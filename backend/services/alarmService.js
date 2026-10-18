import { randomUUID } from "node:crypto";
import { connect as connectMqtt } from "mqtt";

const LEVELS = new Set(["HIGH", "MEDIUM", "CLEAR"]);

// The factory lets outage and delivery behavior be checked without real hardware.
export function createAlarmService({
  env = process.env,
  connect = connectMqtt,
  resolveAddress,
  request = fetch,
  acknowledgementTimeoutMs = 2500,
  now = Date.now,
} = {}) {
  const transport = (env.IOT_TRANSPORT || "http").toLowerCase();
  const prefix = (env.MQTT_TOPIC_PREFIX || "brgy415/alarm-01").replace(/\/+$/, "");
  const pending = new Map();
  let client;
  let started = false;
  let connected = false;
  let deviceStatus = "unknown";
  let configurationError = null;
  let connectionError = null;
  let lastDelivery = null;

  function record(delivery) {
    const result = { ...delivery, updatedAt: new Date(now()).toISOString() };
    lastDelivery = result;
    return result;
  }

  function start() {
    if (started) return;
    started = true;
    if (transport === "http") return;
    if (transport !== "mqtt") {
      configurationError = "IOT_TRANSPORT must be http or mqtt.";
      return;
    }

    try {
      const url = new URL(env.MQTT_URL);
      if (!["mqtts:", "wss:"].includes(url.protocol)) {
        throw new Error("MQTT_URL must use mqtts:// or wss:// for an encrypted connection.");
      }
      if (!env.MQTT_USERNAME || !env.MQTT_PASSWORD) {
        throw new Error("Add MQTT_USERNAME and MQTT_PASSWORD to the backend environment.");
      }
      if (url.username || url.password) {
        throw new Error("Use MQTT_USERNAME and MQTT_PASSWORD instead of credentials in MQTT_URL.");
      }
      if (!prefix || /[+#\u0000]/.test(prefix) || prefix.length > 128) {
        throw new Error("MQTT_TOPIC_PREFIX must be a topic without wildcards (maximum 128 characters).");
      }
    } catch (error) {
      configurationError = error.code === "ERR_INVALID_URL"
        ? "Add a valid MQTT_URL to the backend environment."
        : error.message;
      return;
    }

    try {
      client = connect(env.MQTT_URL, {
        username: env.MQTT_USERNAME,
        password: env.MQTT_PASSWORD,
        clientId: `brgy415-backend-${randomUUID()}`,
        clean: true,
        reconnectPeriod: 5000,
        connectTimeout: 5000,
        resubscribe: false,
        queueQoSZero: false,
        rejectUnauthorized: true,
      });

      client.on("connect", () => {
        connected = false;
        deviceStatus = "unknown";
        client.subscribe([`${prefix}/ack`, `${prefix}/status`], { qos: 1 }, (error, granted) => {
          if (error || !granted?.length || granted.some(({ qos }) => qos === 128)) {
            connectionError = "MQTT login cannot subscribe to the alarm confirmation/status topics.";
            return;
          }
          connected = client.connected;
          connectionError = null;
        });
      });

      client.on("message", (topic, payload, packet) => {
        if (topic === `${prefix}/status`) {
          const status = payload.toString();
          if (status === "online" || status === "offline") deviceStatus = status;
          return;
        }
        // Stored confirmations are not proof that a new command was applied.
        if (topic !== `${prefix}/ack` || packet?.retain) return;
        try {
          const ack = JSON.parse(payload.toString());
          const delivery = pending.get(ack.id);
          if (delivery && ack.level === delivery.level && ack.status === "applied") {
            delivery.finish("confirmed", "ESP32 confirmed that it applied the alarm command.");
          }
        } catch {
          // Ignore malformed device messages; they cannot confirm delivery.
        }
      });

      const disconnected = () => {
        connected = false;
        deviceStatus = "unknown";
        for (const delivery of pending.values()) {
          delivery.finish("unconfirmed", "Connection lost before the ESP32 confirmed the command.");
        }
      };
      client.on("offline", disconnected);
      client.on("close", disconnected);
      client.on("error", () => {
        // Do not expose broker URLs or credentials in API responses or logs.
        connectionError = "Cannot connect to MQTT. Check the server, login, and internet connection.";
      });
    } catch {
      configurationError = "MQTT could not start. Check the backend MQTT configuration.";
    }
  }

  function getStatus() {
    start();
    return {
      transport,
      configured: !configurationError,
      connected,
      deviceStatus,
      lastDelivery,
      message: configurationError || connectionError || undefined,
    };
  }

  async function sendAlert(value) {
    const level = String(value).toUpperCase();
    if (!LEVELS.has(level)) throw new Error("Alarm level must be HIGH, MEDIUM, or CLEAR.");
    start();
    const id = randomUUID();
    const result = { id, level, transport };
    if (configurationError) {
      return record({ ...result, status: "unavailable", message: configurationError });
    }

    if (transport === "http") {
      try {
        const address = await resolveAddress();
        const response = await request(`http://${address}/alert/${level.toLowerCase()}`, {
          signal: AbortSignal.timeout(3000),
        });
        if (!response.ok) throw new Error("Device rejected the request.");
        return record({ ...result, status: "sent", message: "ESP32 accepted the local alarm request." });
      } catch {
        return record({
          ...result,
          status: "unavailable",
          message: "Cannot reach the ESP32 on the local network. Check its Wi-Fi address.",
        });
      }
    }

    if (!connected || !client?.connected || deviceStatus === "offline") {
      return record({
        ...result,
        status: "unavailable",
        message: "Alarm not sent: the MQTT connection or ESP32 is offline. This command will not be replayed later.",
      });
    }

    return new Promise((resolve) => {
      const finish = (status, message) => {
        if (!pending.has(id)) return;
        clearTimeout(timer);
        pending.delete(id);
        resolve(record({ ...result, status, message }));
      };
      const timer = setTimeout(() => {
        finish("unconfirmed", "No ESP32 confirmation received. Check the device before assuming the alarm sounded.");
      }, acknowledgementTimeoutMs);
      pending.set(id, { level, finish });

      try {
        // QoS 0 + no offline queue avoids replaying alarm commands on reconnect.
        // Only a matching application acknowledgement marks delivery confirmed.
        client.publish(`${prefix}/commands`, JSON.stringify({
          id,
          level,
          expiresAt: Math.floor(now() / 1000) + 30,
        }), { qos: 0, retain: false }, (error) => {
          if (error) finish("unconfirmed", "MQTT could not send the command; device delivery is unconfirmed.");
        });
      } catch {
        finish("unconfirmed", "MQTT could not send the command; device delivery is unconfirmed.");
      }
    });
  }

  function stop() {
    for (const delivery of pending.values()) {
      delivery.finish("unconfirmed", "Backend stopped before the ESP32 confirmed the command.");
    }
    connected = false;
    deviceStatus = "unknown";
    client?.end(true);
  }

  return { start, stop, sendAlert, getStatus };
}
