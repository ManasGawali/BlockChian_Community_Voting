const router = require("express").Router();
const userVerification = require("../../middlewares/login_middleware");
const { User, Election, MapCollection } = require("../../models/schema");

router.get("/", userVerification, async (req, res) => {
    try {
        const userId = req.user.id;
    
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Get all unique community keys where user is either admin or regular user
        const allKeys = [
            ...user.communities.admin.map(c => c.community_key),
            ...user.communities.user.map(c => c.community_key)
        ];
        
        const uniqueKeys = [...new Set(allKeys)];
        
        // Find active elections for each community
        const communitiesWithElections = await Promise.all(
            uniqueKeys.map(async (key) => {
                const elections = await Election.find({ community_key: key, status: "active" });
                const community = await MapCollection.findOne({ key });
                
                return {
                    community_key: key,
                    community_name: community?.collectionName || "Unknown",
                    elections: elections
                };
            })
        );
        
        // Return both user data and communities with elections
        res.json({
            user,
            communitiesWithElections
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;