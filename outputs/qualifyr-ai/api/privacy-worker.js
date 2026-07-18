const { json } = require("./_lib");
const { auditLog, correlationId, constantTimeEqual } = require("./_security");
const privacy = require("./_privacy-service");

module.exports = async function privacyWorker(req, res) {
  const cid = correlationId(req), expected = String(process.env.CRON_SECRET || ""), supplied = String(req.headers?.authorization || "").replace(/^Bearer\s+/i, "");
  if (!expected || !constantTimeEqual(supplied, expected)) return json(res, 401, { ok: false, error: "Worker non autorisé." });
  if (!["GET", "POST"].includes(req.method)) return json(res, 405, { ok: false, error: "Méthode non autorisée." });
  const outcomes = [];
  try {
    for (let index = 0; index < 10; index += 1) {
      const outcome = await privacy.processNext();
      if (!outcome.processed) break;
      outcomes.push(outcome);
    }
    auditLog("info", "privacy.worker.completed", { correlationId: cid, operation: "privacy_jobs", processed: outcomes.length });
    return json(res, 200, { ok: true, processed: outcomes.length, outcomes });
  } catch (error) {
    auditLog("error", "privacy.worker.failed", { correlationId: cid, errorCode: privacy.safeErrorCode(error) });
    return json(res, 500, { ok: false, error: "Le worker RGPD a rencontré une erreur.", processed: outcomes.length });
  }
};
