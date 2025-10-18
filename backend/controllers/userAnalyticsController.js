import { Assessment, UserAssessment } from "../models/assessmentModel.js";

function getAssessmentStreak(assessments, now = new Date()) {
  if (!assessments || !assessments.length) return 0;

  const formatLocalDay = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  // unique local days in YYYY-MM-DD, newest first
  const days = [
    ...new Set(assessments.map((a) => formatLocalDay(new Date(a.completedAt)))),
  ]
    .sort() // ascending lexicographic works with YYYY-MM-DD
    .reverse(); // newest first

  const todayStr = formatLocalDay(now);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalDay(yesterday);

  const lastDay = days[0];

  // If the last completed day is neither today nor yesterday, streak is already broken
  if (lastDay !== todayStr && lastDay !== yesterdayStr) return 0;

  // Count consecutive days backwards starting from lastDay
  let streak = 1;
  // parse YYYY-MM-DD into a local Date (avoid 'new Date("YYYY-MM-DD")' timezone pitfalls)
  const [y, m, d] = lastDay.split("-").map(Number);
  const cur = new Date(y, m - 1, d);

  for (let i = 1; i < days.length; i++) {
    cur.setDate(cur.getDate() - 1);
    const prevStr = formatLocalDay(cur);
    if (days[i] === prevStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getAverageTimeSpent(attempts) {
  if (!attempts || attempts.length === 0) return 0;

  let totalMs = 0;
  attempts.forEach((attempt) => {
    let start = new Date(attempt.startedAt);
    let end = new Date(attempt.completedAt);

    if (!isNaN(start) && !isNaN(end) && end > start) {
      totalMs += end - start;
    }
  });

  return totalMs / (1000 * 60); // minutes
}

function getCompletedAndPending(allAssessments, userAttempts) {
  const completed = allAssessments?.filter((a) =>
    userAttempts.some((u) => u.assessmentId?.equals(a._id))
  );

  const pending = allAssessments?.filter(
    (a) => !userAttempts.some((u) => u.assessmentId?.equals(a._id))
  );

  return {
    total: allAssessments.length,
    completed,
    pending,
    completedCount: completed.length,
    pendingCount: pending.length,
  };
}
function normalizeScore(score, maxScore) {
  return (score / maxScore) * 10;
}

export const getUserAnalyticsData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days, therapyType } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!therapyType) {
      return res.status(400).json({ message: "therapyType is required" });
    }

    // helper: dynamic label for therapy metric
    const getTherapyMetricLabel = (therapyType) => {
      switch (therapyType) {
        case "individual":
          return "Emotional Wellbeing";
        case "couple":
          return "Relationship Health";
        case "family":
          return "Family Harmony";
        case "child":
          return "Development & Growth";
        default:
          return "Emotional Wellbeing";
      }
    };

    // --- Current period filter ---
    const userassessmentsQuery = { userId, therapyType };
    let dayCount = parseInt(days) || null;

    if (dayCount) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dayCount);
      userassessmentsQuery.completedAt = { $gte: startDate };
    }

    const currentAssessments = await UserAssessment.find(userassessmentsQuery)
      .populate("assessmentId", "title description questions scoringRanges")
      .sort({ completedAt: -1 });

    // 🔹 Only fetch assessments of that therapyType
    const assessments = await Assessment.find({ therapyType });

    // --- Streak & Time Calculations ---
    const totalMinutes = getAverageTimeSpent(currentAssessments);
    const avgMinutes = totalMinutes / (currentAssessments.length || 1);
    const totalHours = totalMinutes / 60;

    const streak = getAssessmentStreak(currentAssessments);
    const { total, completedCount, pendingCount } = getCompletedAndPending(
      assessments,
      currentAssessments
    );

    // --- Category Scores ---
    const categoryScores = {};
    currentAssessments.forEach((ua) => {
      const questions = ua.assessmentId.questions || [];
      const maxScore =
        ua.assessmentId.scoringRanges?.reduce(
          (acc, curr) => Math.max(acc, curr.maxScore || 0),
          0
        ) || 30;

      questions.forEach((q) => {
        const cat = q.category?.toLowerCase() || "unknown";
        const score = normalizeScore(ua.totalScore, maxScore);
        if (!categoryScores[cat]) categoryScores[cat] = [];
        categoryScores[cat].push(score);
      });
    });

    const avgCategoryScores = {};
    Object.keys(categoryScores).forEach((cat) => {
      const scores = categoryScores[cat];
      avgCategoryScores[cat] =
        scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    // --- Metric Calculation (currently based on stress, but reusable) ---
    const normalizeMetric = (ua) => {
      if (!ua) return 0;
      const maxScore =
        ua.assessmentId.scoringRanges?.reduce(
          (acc, curr) => Math.max(acc, curr.maxScore || 0),
          0
        ) || 10;
      const relevantQuestions = (ua.assessmentId.questions || []).filter(
        (q) => q.category?.toLowerCase() === "stress" // TODO: make category dynamic per therapyType
      );
      if (!relevantQuestions.length) return 0;
      return normalizeScore(ua.totalScore, maxScore);
    };

    const avgScore = (arr) =>
      arr.length
        ? arr.reduce((sum, a) => sum + (a.totalScore || 0), 0) / arr.length
        : 0;

    const avgMetric = (arr) =>
      arr.length
        ? arr.map(normalizeMetric).reduce((sum, s) => sum + s, 0) / arr.length
        : 0;

    // --- Previous period filter for comparison ---
    let lastAssessments = [];
    if (dayCount) {
      const lastStart = new Date();
      lastStart.setDate(lastStart.getDate() - dayCount * 2);
      const lastEnd = new Date();
      lastEnd.setDate(lastEnd.getDate() - dayCount);

      lastAssessments = await UserAssessment.find({
        userId,
        therapyType,
        completedAt: { $gte: lastStart, $lt: lastEnd },
      })
        .populate("assessmentId", "title description questions scoringRanges")
        .sort({ completedAt: -1 });
    } else if (currentAssessments.length > 1) {
      lastAssessments = [currentAssessments[1]];
    }
    const overallCurrent = avgScore(currentAssessments);
    const overallLast = avgScore(lastAssessments);

    const overallChange = overallLast
      ? ((overallCurrent - overallLast) / overallLast) * 100
      : 0;

    const metricCurrent = avgMetric(currentAssessments);
    const metricLast = avgMetric(lastAssessments);

    const metricChange = metricLast
      ? ((metricCurrent - metricLast) / metricLast) * 100
      : 0;

    // --- Achievement Badges ---
    const badges = {};
    badges.firstAssessment = currentAssessments.length > 0;
    badges.weekStreak = streak >= 7;
    const completedThisWeek = currentAssessments.filter(
      (ua) =>
        (new Date() - new Date(ua.completedAt)) / (1000 * 60 * 60 * 24) <= 7
    ).length;
    badges.consistentTracker = completedThisWeek >= 3;
    const completedThisMonth = currentAssessments.filter(
      (ua) =>
        (new Date() - new Date(ua.completedAt)) / (1000 * 60 * 60 * 24) <= 30
    ).length;
    badges.monthChampion = completedThisMonth >= 10;
    badges.mindfulWriter = currentAssessments.some(
      (ua) => ua.notes?.length > 0
    );
    badges.earlyBird = currentAssessments.some(
      (ua) => new Date(ua.completedAt).getHours() < 6
    );

    return res.status(200).json({
      streak,
      avgPerAssessment: `${avgMinutes.toFixed(2)} min`,
      totalTimeSpent: `${totalHours.toFixed(1)} hours`,
      totalAssessments: total,
      completedCount,
      pendingCount,
      avgCategoryScores: Object.fromEntries(
        Object.entries(avgCategoryScores).map(([k, v]) => [k, v.toFixed(2)])
      ),
      badges,
      userassessments: currentAssessments,

      // ✅ Overall wellbeing
      overallWellbeingCurrent: overallCurrent.toFixed(2),
      overallWellbeingLast: overallLast.toFixed(2),
      overallWellbeingChange: overallChange.toFixed(1),

      // ✅ Dynamic therapy metric
      therapyMetric: {
        label: getTherapyMetricLabel(therapyType),
        current: metricCurrent.toFixed(2),
        last: metricLast.toFixed(2),
        change: metricChange.toFixed(1),
      },
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};
