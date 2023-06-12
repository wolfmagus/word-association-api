const PORT = 8000
const express = require("express")
const cors = require("cors")
require("dotenv").config()
const axios = require("axios")
const app = express()
app.use(cors())
const path = require("path")


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://wolfmagus:M@ngekyou4464@cluster0.mdy4n.mongodb.net/word-association-app-database?retryWrites=true&w=majority";

//Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.use(express.static(path.join(__dirname, "client", "build")))


app.get("/", (req,res)=> {
    res.json("hi")
})
app.get("/results", async (req,res) => {
    const passedLevel = req.query.level
    console.log(passedLevel)

    const options = {
        method: 'GET',
        url: 'https://twinword-word-association-quiz.p.rapidapi.com/type1/',
        params: {level: passedLevel, area: 'sat'},
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY ,
          'X-RapidAPI-Host': 'twinword-word-association-quiz.p.rapidapi.com'
        }
      }
      
      try {
          const response = await axios.request(options)
          res.json(response.data)
        
      } catch (error) {
          console.error(error)
      }
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))