const NOTICE_TIMEOUT = 6000;

function parseEvery(every) {
  if (every == null) return null;
  const s = String(every).trim().toLowerCase();
  if (s === "daily") return { days: 1 };
  if (s === "weekly") return { days: 7 };
  if (s === "monthly") return { months: 1 };
  if (s === "yearly" || s === "annually") return { years: 1 };
  const m = s.match(/^([\d.]+)\s*(d|w|m|y)$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const unit = m[2];
  if (unit === "d") return { days: n };
  if (unit === "w") return { days: n * 7 };
  if (unit === "m") return { months: n };
  if (unit === "y") return { years: n };
  return null;
}

async function rearm(app, quickAddApi) {
  const file = app.workspace.getActiveFile();
  if (!file) {
    new Notice("No active note.", NOTICE_TIMEOUT);
    return;
  }
  const cache = app.metadataCache.getFileCache(file);
  const fm = cache && cache.frontmatter ? cache.frontmatter : file.frontmatter || {};
  if (!fm || !Array.isArray(fm.type) || !fm.type.includes("recurring")) {
    const ok = await quickAddApi.yesNoPrompt?.(
      "Not a recurring note",
      "This note isn't a recurring action. Re-arm it anyway (parse `every` and bump `next`)?"
    );
    if (!ok) return;
  }
  const interval = parseEvery(fm.every);
  if (!interval) {
    new Notice(`Can't parse every: "${fm.every}" (use e.g. 7d, 1w, 2w, 1m, monthly).`, NOTICE_TIMEOUT);
    return;
  }
  const base = fm.next ? window.moment(fm.next) : window.moment();
  if (!base.isValid()) {
    new Notice(`Can't parse next: "${fm.next}".`, NOTICE_TIMEOUT);
    return;
  }
  const next = base
    .add(interval.days || 0, "days")
    .add(interval.months || 0, "months")
    .add(interval.years || 0, "years")
    .format("YYYY-MM-DD");
  const today = window.moment().format("YYYY-MM-DD");

  await app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter.next = next;
    frontmatter.status = ["next"];
    frontmatter.completed = "";
    frontmatter.last = fm.last || "";
    frontmatter.created = fm.created || today;
  });

  new Notice(`Re-armed. Next due: ${next}`, NOTICE_TIMEOUT);
}

module.exports = async (params) => {
  const { app, quickAddApi } = params;
  await rearm(app, quickAddApi);
};