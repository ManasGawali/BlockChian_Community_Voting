const bcrypt = require('bcrypt');
const router = require('express').Router();
const { MapCollection, User,createDynamicCollection } = require("../../models/schema");
const generateKeys = require("../../controllers/generateKey");
const userVerification=require("../../middlewares/login_middleware");

router.post("/",userVerification, async (req, res) => {
    try {
        const community_name = req.body.cname;
        const community_pass = req.body.password;
        const fieldsArray = req.body.field;
        const admin_id=req.user.id;
        // Create the dynamic collection
        const ans = await createDynamicCollection(admin_id,community_name, fieldsArray);
        const key = generateKeys(ans);

        // **Hash the password before storing it**
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(community_pass, saltRounds);

        // Save to database
        const newCollection = new MapCollection({
            collectionName: community_name,
            password: hashedPassword, // Store hashed password
            key: key,
            field:fieldsArray, 
        }); 

        await newCollection.save();

        await User.updateOne(
            { _id: admin_id },
            {
              $push: {
                "communities.admin": {
                  community_key: key
                }
              }
            }
          );
        

        return res.json({ msg: "Collection created and key generated", ans: ans, key: key });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
