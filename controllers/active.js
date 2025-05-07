const asyncHandler = require("express-async-handler");
const ActivityLog = require("../models/activeSchema");
const { subDays, startOfDay, endOfDay } = require("date-fns");


exports.get = asyncHandler(async (req, res) => {
    try {
        const today = new Date();
        const data = [];
    
        for (let i = 6; i >= 0; i--) {
          const dayStart = startOfDay(subDays(today, i));
          const dayEnd = endOfDay(subDays(today, i));
    
          const uniqueUsers = await ActivityLog.distinct("userId", {
            loginTime: { $gte: dayStart, $lte: dayEnd },
          });
    
          data.push({
            day: dayStart.toLocaleDateString("en-US", { weekday: "short" }), // Mon, Tue, etc.
            count: uniqueUsers.length,
          });
        }
    
        res.json(data);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch activity data" });
      }

})

