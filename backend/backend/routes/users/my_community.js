const router = require("express").Router();
const { User, MapCollection } = require("../../models/schema");
const userVerification = require("../../middlewares/login_middleware");

router.get("/", userVerification, async (req, res) => {
    try {
        const user_id = req.user.id;
        const user = await User.findById(user_id);
        const adminCommunities = user.communities.admin;
        const userCommunities = user.communities.user;

        const admincollectionNames = [];

        for (const admin of adminCommunities) {
            const mapped = await MapCollection.findOne({ key: admin.community_key });
            if (mapped) {
                admincollectionNames.push({
                    collectionName: mapped.collectionName,
                    key: mapped.key
                });
            }
        }

        const usercollectionNames = [];

        for (const user of userCommunities) {
            const mapped = await MapCollection.findOne({ key: user.community_key });
            if (mapped) {
                usercollectionNames.push({
                    collectionName: mapped.collectionName,
                    key: mapped.key
                });
            }
        }

        return res.json({ admin:admincollectionNames, user:usercollectionNames }); // ✅ Send just the names
    } catch (err) {
        console.error("Error in /communities route:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
