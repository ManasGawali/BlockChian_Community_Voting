const mongoose = require('mongoose');


// Connect to MongoDB
mongoose.connect("mongodb+srv://kulkarnivyankatesh06:OyiXF7FAg33WjRhV@cluster0.mg0zdwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Voting", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ Error connecting to MongoDB:", err));

// User Schema
const communitySubSchema = new mongoose.Schema({
    community_key: { type: String }
  }, { _id: true }); // allow _id for default Mongo behavior
  
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    communities: {
      admin: [communitySubSchema],
      user: [communitySubSchema]
    }
});

const sanitizeCollectionName = (name) => {
    if (!name || typeof name !== "string") throw new Error("Invalid collection name");
    return name.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
};

// Function to create dynamic collections
const createDynamicCollection = async (admin_id, collectionName, fieldsArray) => {
    try {
        // Sanitize the collection name
        collectionName = sanitizeCollectionName(collectionName);

        let schemaFields = {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref:"User",required: true },
        };

        // This will hold the sample data to be inserted
        const sampleData = {};

        // Define schema fields and prepare sample data
        fieldsArray.forEach(field => {
            let fieldType = {};
            switch (field.type1) {
                case "String":
                    fieldType = { type: String, required: true };
                    sampleData[field.data] = String(field.sample); // ensure it's a string
                    break;
                case "Number":
                    fieldType = { type: Number, required: true };
                    sampleData[field.data] = Number(field.sample);
                    break;
                case "Boolean":
                    fieldType = { type: Boolean, required: true };
                    sampleData[field.data] = Boolean(field.sample);
                    break;
                case "Date":
                    fieldType = { type: Date, required: true };
                    sampleData[field.data] = new Date(field.sample);
                    break;
                default:
                    fieldType = { type: String, required: true };
                    sampleData[field.data] = String(field.sample);
            }
            schemaFields[field.data] = fieldType;
        });

        // Log what's happening
        console.log("✅ Final Collection Name:", collectionName);
        console.log("✅ Schema Fields:", schemaFields);
        console.log("✅ Sample Data:", sampleData);

        // Create the dynamic schema and model
        const dynamicSchema = new mongoose.Schema(schemaFields);
        const DynamicModel = mongoose.model(collectionName, dynamicSchema);

        // Add the user_id
        sampleData.user_id = admin_id;

        // Insert sample data
        const inserted = await DynamicModel.create(sampleData);
        console.log("✅ Inserted Document:", inserted);

        return `Collection '${collectionName}' created and sample data inserted.`;
    } catch (error) {
        console.error("❌ Error creating dynamic collection or inserting data:", error);
        throw new Error(error.message);
    }
};

const electionSchema = new mongoose.Schema({
    electionName: {
      type: String,
    },
    community_key: {
      type: String,
      required: true,
    },
    election_address:{
      type:String,
      required:true,
    },
    resultsPublished:{
      type:Boolean,
      default:false,
    },
    publishedAt:{
      type:Date,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "over"],
      default: "upcoming",
    },
    candidate_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    applicableFields: [
      {
        field: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    results: {
      type: [
        {
          candidate_id: { type: mongoose.Schema.Types.ObjectId },
          votes: { type: Number },
        },
      ],
      default: [],
    },
  });
  

// Mapped Collection Schema (to track dynamic collections)
const mapCollectionSchema = new mongoose.Schema({
    collectionName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    key: { type: String, required: true },
    field: [
      {
        data: { type: String, required: true },
        type1: { type: String, required: true }, // You could validate type1 further if needed
        sample: { type: mongoose.Schema.Types.Mixed, required: true } // Mixed allows String or Number
      }
    ]
});
  

// Mongoose Models
const MapCollection = mongoose.model("MappedCollection", mapCollectionSchema);
const User = mongoose.model("User", userSchema);
const  Election=mongoose.model("Election", electionSchema);

// Export Models & Functions
module.exports = { MapCollection, User,Election ,createDynamicCollection };
