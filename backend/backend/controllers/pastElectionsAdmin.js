const { User, Election, MapCollection } = require("../models/schema/User");

const pastElectionsAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const communityKeys = user.communities.admin.map((c) => c.community_key);

    const result = await Promise.all(
      communityKeys.map(async (key) => {
        const elections = await Election.find({ community_key: key, status: "over" });
        const community = await MapCollection.findOne({ key });
        return {
          community_key: key,
          community_name: community?.collectionName || "Unknown",
          elections // includes results inside each election object
        };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching past elections for admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default pastElectionsAdmin;


// ------------------------------------ sample format -------------------------------------

// "results": [
//   {
//     "candidate_id": "652f01...",
//     "votes": 87
//   },
//   ...
// ]

// -----------------------------------------------------------------------------------------