const router=require('express').Router();
const {MapCollection}=require("../../models/schema");
const UserVerification=require("../../middlewares/login_middleware");
const mongoose=require("mongoose");

const inferSchemaFromCollection = async (collectionName) => {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
  
      // Find one document to infer schema
      const sampleDoc = await collection.findOne();
      if (!sampleDoc) {
        console.log('No documents found in the collection.');
        return;
      }
  
      return sampleDoc;
    } catch (error) {
      console.error('Error fetching schema:', error);
    }
  };


router.post("/",UserVerification,async(req,res)=>{
    const CollectionId=req.body.collection_key;
    const getCollection=await MapCollection.findOne({key:CollectionId});
    console.log(getCollection.collectionName);
    const name=getCollection.collectionName.toLowerCase()+"s";
    const fetched_schema=await inferSchemaFromCollection(name);
    return res.json({schema:fetched_schema});
})  

module.exports=router;

