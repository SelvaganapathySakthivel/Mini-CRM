const Lead = require("../models/Lead");
const Task = require("../models/Task");

/**
 * GET /api/dashboard/stats
 * Dashboard metrics aggregated directly via MongoDB Aggregation pipelines
 *
 * Metrics:
 * - totalLeads: All active leads (isDeleted: false)
 * - qualifiedLeads: Leads in active qualified stage ("Contacted" / "Qualified")
 * - tasksDueToday: Tasks whose dueDate falls within today (00:00:00 - 23:59:59)
 * - completedTasks: Tasks with status "Completed"
 */
const getDashboardStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [leadAggregation, taskAggregation] = await Promise.all([
      Lead.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,
            totalLeads: { $sum: 1 },
            qualifiedLeads: {
              $sum: {
                $cond: [{ $in: ["$status", ["Contacted", "Qualified"]] }, 1, 0],
              },
            },
          },
        },
      ]),

      Task.aggregate([
        {
          $facet: {
            completedTasks: [
              {
                $match: {
                  status: "Completed",
                },
              },
              {
                $count: "count",
              },
            ],
            tasksDueToday: [
              {
                $match: {
                  dueDate: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                  },
                },
              },
              {
                $count: "count",
              },
            ],
          },
        },
      ]),
    ]);

    const totalLeads = leadAggregation[0]?.totalLeads || 0;
    const qualifiedLeads = leadAggregation[0]?.qualifiedLeads || 0;
    const completedTasks = taskAggregation[0]?.completedTasks[0]?.count || 0;
    const tasksDueToday = taskAggregation[0]?.tasksDueToday[0]?.count || 0;

    res.json({
      totalLeads,
      qualifiedLeads,
      tasksDueToday,
      completedTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
