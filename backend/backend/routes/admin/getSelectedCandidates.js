const router = require('express').Router();
const { Election, User } = require("../../models/schema");
const mongoose = require("mongoose");
const userVerification = require("../../middlewares/login_middleware");

router.post("/", userVerification, async (req, res) => {
    try {
        const {electionId} = req.body;

        if (!mongoose.Types.ObjectId.isValid(electionId)) {
            return res.status(400).json({ msg: "Invalid election ID" });
        }

        // Step 1: Find the election document
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ msg: "Election not found" });
        }

   
        const candidateIds = election.candidate_id.map(id => new mongoose.Types.ObjectId(id));

  
        const candidates = await User.find(
            { _id: { $in: candidateIds } },
            'username' 
        );

        const enrichedCandidates = candidates.map(candidate => ({
            id: candidate._id,
            username: candidate.username
        }));

        return res.json({ 
            electionData:election,
            admin: req.user.id, 
            candidates: enrichedCandidates 
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
