const express=require("express");
const cors=require("cors");

const app=express();

const login=require("../backend/routes/users/users_login");
const CommunityCreation=require("../backend/routes/admin/create_community");
const joinCommunity=require("../backend/routes/users/join_community");
const myCommunity=require("./routes/users/my_community");
const getSchema=require("./routes/admin/dynamic_schema_fetch");
const createElection=require("./routes/admin/create_election");
const activeElection=require("./routes/users/active_election");
const pastElections=require("./routes/users/past_election");
const getCandidates=require("./routes/admin/getCandidates");
const election_Status_check=require("./jobs/electionsCheck");
const getElections=require("./routes/users/getElections");
const getSelectedCandidates=require("./routes/admin/getSelectedCandidates");
const userVerifier=require("./routes/blockchain/verifier");
const publishedResults=require("./routes/admin/getStatusResult");



app.use(cors({
  origin: "https://block-chian-community-voting.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "token", "key"],
  optionsSuccessStatus: 200,
}));
app.use(express.json());
election_Status_check();
app.use("/user", login);
app.use("/admin/createCommunity",CommunityCreation);
app.use("/join_community",joinCommunity);
app.use("/myCommunity", myCommunity);
app.use("/getSchema", getSchema);
app.use("/createElection", createElection);
app.use("/activeElection", activeElection);
app.use("/pastElections", pastElections);
app.use("/getCandidates",getCandidates);
app.use("/getElections",getElections);
app.use("/getSelectedCandidates",getSelectedCandidates);
app.use("/verifier",userVerifier);
app.use("/publishResults",publishedResults);

app.listen(5001,()=>{
    console.log('listening on port 5001');
})