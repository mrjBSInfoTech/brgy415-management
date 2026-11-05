Message validation evaluation
=============================

Run `npm run eval:messages` from `backend` with `GEMINI_API_KEY` configured in
the environment or `backend/.env`. This makes real API requests using the same
classifier and local filter as the concern route. It never imports the database
or alarm service and cannot save concerns or send IoT alerts.

The labeled cases include Filipino, English, Taglish, random typing, figurative
emergency words, admitted pranks, and real emergencies with similar wording.
The four resident examples are out of scope under the dashboard policy; that
does not establish that the resident is lying. In particular, a bare five-peso
theft remark is excluded, while a threat or explicit mediation complaint is not.

Calls are spaced 13 seconds apart. A service failure stops evaluation and is
reported separately from a classification mismatch. Results are saved to
`results/messageValidation.json`. Subsequent runs resume a matching policy's
results. Run `node evaluations/messageValidation.js --fresh` for a full new run.

The report records validity plus urgency/type checks where the expected value
is specified. Its pass count describes this small synthetic sample, not general
accuracy. `npm test` is offline and tests local filtering, input separation,
response validation, and failure handling; it does not measure Gemini accuracy.
