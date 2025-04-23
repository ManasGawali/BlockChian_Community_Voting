// In your backend publishResults handler:
const router=require("express").Router();
const {Election} =require("../../models/schema");

router.post('/', async (req, res) => {
    try {
      const { electionId } = req.body;
      
      // 1. Mark the election as published in the database
      await Election.findByIdAndUpdate(electionId, { 
        resultsPublished: true,
        publishedAt: new Date()
      });
      
      // 2. Optional: You could fetch results from blockchain and store them
      // This creates a backup in your database and makes results loading faster
      
      res.status(200).json({ success: true, message: "Results published successfully" });
    } catch (error) {
      console.error('Error publishing results:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  module.exports=router;
