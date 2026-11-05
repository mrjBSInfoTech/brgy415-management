// Calls the same classifier as the route, without saving messages or triggering IoT.
import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { classifyMessageWithAI } from "../services/messageClassifier.js";
import { detectMessageTripping, MESSAGE_VALIDATION_INSTRUCTIONS } from "../services/messageValidation.js";
import { cases } from "./messageValidation.cases.js";

const policyHash = createHash("sha256").update(MESSAGE_VALIDATION_INSTRUCTIONS).digest("hex");
const reportUrl = new URL("./results/messageValidation.json", import.meta.url);
let results = [];
if (!process.argv.includes("--fresh")) {
  try {
    const previous = JSON.parse(await readFile(reportUrl, "utf8"));
    if (previous.policyHash === policyHash &&
        previous.results.every((item, index) => item.message === cases[index]?.message)) {
      results = previous.results;
      console.log(`Resuming after ${results.length} completed cases.`);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
let serviceError = null;
for (const sample of cases.slice(results.length)) {
  try {
    const local = detectMessageTripping(sample.message);
    // Pace live calls for the configured free-tier per-minute limit.
    if (!local) await new Promise((resolve) => setTimeout(resolve, 13000));
    const actual = local || await classifyMessageWithAI(sample.message);
    const passed = actual.valid === sample.valid &&
      (!sample.urgency || actual.urgency === sample.urgency) &&
      (!sample.type || actual.type === sample.type);
    results.push({ ...sample, actual, source: local ? "local" : "gemini", passed });
    console.log(`${passed ? "PASS" : "FAIL"} ${results.length}/${cases.length}: ${sample.message}`);
  } catch (error) {
    // Avoid logging SDK errors containing request URLs or credentials.
    const details = error.errorDetails || [];
    serviceError = {
      status: error.status || null,
      message: "Live validation service request failed; evaluation stopped.",
      retryDelay: details.find((item) => item["@type"]?.endsWith("RetryInfo"))?.retryDelay || null,
      quotaIds: details.flatMap((item) => (item.violations || []).map((violation) => violation.quotaId)),
    };
    console.error(serviceError.message, serviceError.status || "");
    if (serviceError.quotaIds.length) console.error("Quota limits:", serviceError.quotaIds.join(", "));
    break;
  }
}
const report = {
  evaluatedAt: new Date().toISOString(), model: "gemini-2.5-flash", policyHash,
  total: cases.length, evaluated: results.length,
  passed: results.filter((item) => item.passed).length,
  failed: results.filter((item) => !item.passed).length,
  serviceError, results,
};
await mkdir(new URL("./results/", import.meta.url), { recursive: true });
await writeFile(reportUrl, JSON.stringify(report, null, 2) + "\n");
console.log(`Passed ${report.passed}/${report.evaluated}; ${report.total - report.evaluated} not evaluated.`);
if (serviceError || report.failed) process.exitCode = 1;
