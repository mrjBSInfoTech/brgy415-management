import test from "node:test";
import assert from "node:assert/strict";
import { detectMessageTripping } from "../services/messageValidation.js";

test("legitimate and ambiguous concerns reach contextual validation", () => {
  for (const message of [
    "Sunog po sa kanto", "May baril sa labas", "Tulong po!",
    "Niloko ako ng contractor, hindi ginawa ang bubong",
    "May sunog, masakit ang ulo ko", "May testing ng fire alarm bukas",
    "Hello! Kailangan ko ng barangay clearance",
    "May utang po si Joseph", "Nanakaw ang tsinelas ko",
    "Nangagat ang daga, kailangan ko ng tulong",
    "Pahingi ng pagkain para sa mga nasalanta",
    "Patay ang ilaw sa kanto", "hnd makahinga tulong",
    "May basura sa kanal", "May qwerty na nakasulat sa sirang sign",
    "May gulo 😂", "May nanghahabol sa labas!!!",
  ]) assert.equal(detectMessageTripping(message), null, message);
});

test("empty, malformed, and unambiguous spam input is rejected", () => {
  for (const message of [undefined, null, 123, {}, [], "", "  ", "123456", "!!!", "😂😂", "asdfghjkl", "qwerty", "aaaaaa", "Testing!", "hello", "pogi ako"])
    assert.equal(detectMessageTripping(message)?.valid, false, JSON.stringify(message));
});
