// Scoring and plan logic for the website diagnosis. Shared by the quiz page
// (browser: window.quizEvaluate) and the report email (Node: require).
(function (root) {
  function evaluate(data, answers) {
    var qs = data.questions;
    var pick = function (i) { var a = answers[i]; return a == null ? null : qs[i].options[a]; };
    var noSite = !!(pick(0) && pick(0).skip);
    var goalOpt = pick(qs.length - 1);
    var goal = goalOpt ? goalOpt.g : "explore";
    if (noSite) {
      return { noSite: true, score: null, band: null, weakTop: [], weakAll: [], goal: goal, plan: "engine" };
    }
    var points = 0, max = 0, reachLeads = 0, scored = [];
    qs.forEach(function (q, i) {
      if (!q.cat) return;
      var o = pick(i);
      var p = o ? o.p : 0;
      points += p;
      max += 2;
      if (q.cat === "reach" || q.cat === "leads") reachLeads += p;
      if (p > 0) scored.push({ id: q.id, p: p });
    });
    var score = Math.round(100 - (points / max) * 100);
    var band = data.bands.filter(function (b) { return score >= b.min; })[0];
    // Strongest problems first, keeping the questions' order within each level
    var weakAll = scored.filter(function (w) { return w.p === 2; }).concat(scored.filter(function (w) { return w.p === 1; }));
    // The goal leads: "image" gets the New Look unless visibility and enquiries
    // are badly off (5+ of 8 points); with some problems there (3–4), the
    // result also mentions the Enquiry Engine
    var plan, alsoEngine = false;
    if (score >= 80) plan = "call";
    else if (goal === "explore") plan = "free";
    else if (goal === "image") {
      plan = reachLeads >= 5 ? "engine" : "visual";
      alsoEngine = plan === "visual" && reachLeads >= 3;
    }
    else plan = "engine";
    return {
      noSite: false, score: score, band: band, goal: goal, plan: plan, alsoEngine: alsoEngine,
      weakTop: weakAll.slice(0, 3).map(function (w) { return w.id; }),
      weakAll: weakAll.map(function (w) { return w.id; })
    };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = evaluate;
  else root.quizEvaluate = evaluate;
})(this);
