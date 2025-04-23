const router = require('express').Router();
const { MapCollection, User } = require("../../models/schema");
const mongoose = require("mongoose");
const userVerification = require("../../middlewares/login_middleware");

router.post("/", userVerification, async (req, res) => {
    try {
        const community_key = req.body.community_key;
        const mapCollection = await MapCollection.findOne({ key: community_key });

        if (!mapCollection) {
            return res.status(404).json({ msg: "Community not found" });
        }

        const collectionName = mapCollection.collectionName.toLowerCase() + "s";
        const db = mongoose.connection.db;
        const collection = db.collection(collectionName);
        const candidates = await collection.find({}).toArray();

        const enrichedCandidates = await Promise.all(
            candidates.map(async (candidate) => {
                const user = await User.findById(candidate.user_id).select("username");
                return {
                    ...candidate,
                    username: user ? user.username : "Unknown"
                };
            })
        );

        return res.json({ admin:req.user.id, candidates: enrichedCandidates });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
});


module.exports = router;
