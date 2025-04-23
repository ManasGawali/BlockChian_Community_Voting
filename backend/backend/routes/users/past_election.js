const router = require("express").Router();
const userVerification = require("../../middlewares/login_middleware");
const { User, Election, MapCollection } = require("../../models/schema");


router.get("/",userVerification, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
      
        const allKeys = [
          ...user.communities.admin.map(c => c.community_key),
          ...user.communities.user.map(c => c.community_key)
        ];
      
        const uniqueKeys = [...new Set(allKeys)];
      
        const result = await Promise.all(
          uniqueKeys.map(async (key) => {
            const elections = await Election.find({ community_key: key, status: "over" });
            const community = await MapCollection.findOne({ key });
            return {
              community_key: key,
              community_name: community?.collectionName || "Unknown",
              elections
            };
          })
        );
      
        res.status(200).json(result);
      } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ message: "Server error" });
      }
      
});

module.exports = router;