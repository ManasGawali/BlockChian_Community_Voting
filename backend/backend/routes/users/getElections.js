const router = require("express").Router();
const userVerification = require("../../middlewares/login_middleware");
const { Election } = require("../../models/schema");

router.get("/", userVerification, async (req, res) => {
  try {
    const userId = req.user.id;
    const community_key = req.query.community_key; // use query param

    if (!community_key) {
      return res.status(400).json({ message: "community_key is required" });
    }

    const elections = await Election.find({ community_key });

    res.json(elections);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
