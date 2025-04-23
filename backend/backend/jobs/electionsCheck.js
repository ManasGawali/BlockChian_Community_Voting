const cron = require("node-cron");
const { Election } = require("../models/schema");

const startElectionStatusCron = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    console.log(" Running election status check at:", now.toISOString());

    try {
      // 1. Mark elections as 'over' if endDate passed
      const overResult = await Election.updateMany(
        {
          endDate: { $lt: now },
          status: { $nin: ["over"] }
        },
        { $set: { status: "over" } }
      );

      // 2. Mark elections as 'active' if now is between startDate and endDate
      const activeResult = await Election.updateMany(
        {
          startDate: { $lte: now },
          endDate: { $gte: now },
          status: { $nin: ["active"] } // catches 'upcoming', 'pending', etc.
        },
        { $set: { status: "active" } }
      );

      // 🛠 Optional: print elections currently active
      const activating = await Election.find({
        startDate: { $lte: now },
        endDate: { $gte: now },
        status: "active"
      });

      console.log(` ${overResult.modifiedCount} elections marked as over.`);
      console.log(` ${activeResult.modifiedCount} elections marked as active.`);
      console.log(" Currently active elections:", activating.map(e => e.electionName));
    } catch (err) {
      console.error(" Error updating election status:", err);
    }
  });
};

module.exports = startElectionStatusCron;
