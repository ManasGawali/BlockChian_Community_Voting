const router = require('express').Router();
const { Election, MapCollection } = require("../../models/schema");
const userVerification = require("../../middlewares/login_middleware");
const mongoose = require("mongoose");

router.post("/", userVerification, async (req, res) => {
    try {
        const {
            electionName,
            community_key,
            contractAddress,
            status,
            candidate_id,
            startDate,
            endDate,
            description,
            applicableFields,
            results
        } = req.body;

        // Validate required fields
        if (!electionName || !community_key || !contractAddress || !status || !candidate_id || !startDate || !endDate) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        // Create new election object with contractAddress as election_address
        const newElection = new Election({
            electionName,
            community_key,
            election_address: contractAddress, // Map contractAddress to election_address
            status,
            candidate_id,
            startDate,
            endDate,
            description,
            applicableFields,
            results
        });

        // Find the collection name from MapCollection
        const mapCollection = await MapCollection.findOne({ key: community_key });
        if (!mapCollection) {
            return res.status(404).json({ msg: "Community not found" });
        }
        const collectionName = mapCollection.collectionName.toLowerCase() + "s";
        const db = mongoose.connection.db;
        const collection = db.collection(collectionName);

        // Build query for voters based on applicableFields
        const query = {};
        applicableFields.forEach(({ field, value }) => {
            if (field && value) {
                query[field] = value;
            }
        });

        // Fetch voters based on query
        const voters = await collection.find(query, { projection: { _id: 1 } }).toArray();

        // Calculate election cost
        const cost_elections = voters.length * 0.01;

        // Save the election to the database
        const savedElection = await newElection.save();

        // Respond with success
        res.status(201).json({
            message: "Election created successfully",
            electionName: savedElection.electionName,
            cost: cost_elections,
            candidates: candidate_id,
            voter_array: voters
        });
    } catch (e) {
        console.error("Error creating election:", e);
        return res.status(400).json({ msg: e.message });
    }
});

module.exports = router;