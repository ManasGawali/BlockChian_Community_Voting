const {Election} = require("../models/schema")

const vote = async(req, res) => {
    const {electionId} = req.body;

    const election = await Election.find({_id : electionId})
    const candidates = election.candidate_id

    console.log(candidates);
    res.json(candidates);
}

export default vote;