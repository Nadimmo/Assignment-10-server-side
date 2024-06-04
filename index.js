const express = require("express");
const corse = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(
  corse({
    origin: [
      "http://localhost:5173",
      "https://assignment-1010.web.app",
      "https://assignment-1010.firebaseapp.com",
    ],
  })
);

// console.log(process.env.DB_USER)

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rrkijcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // collection of database
    const CollectionOfLandscapes = client
      .db("LandscapeDB")
      .collection("landscapes");
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    // landscapes related api
    app.post("/landscapes", async (req, res) => {
      const arts = req.body;
      const result = await CollectionOfLandscapes.insertOne(arts);
      res.send(result);
    });

    app.get("/landscapes", async (req, res) => {
      const arts = CollectionOfLandscapes.find();
      const result = await arts.toArray();
      res.send(result);
    });

    app.get("/landscapes/:id", async (req, res) => {
      const id = req.params;
      const newId = { _id: new ObjectId(id) };
      const result = await CollectionOfLandscapes.findOne(newId);
      res.send(result);
    });
    app.delete("/landscapes/:id", async (req, res) => {
      const id = req.params.id;
      const newId = { _id: new ObjectId(id) };
      const result = await CollectionOfLandscapes.deleteOne(newId);
      res.send(result);
    });

    app.put("/landscapes/:id", async (req, res) => {
      const id = req.params.id;
      const cart = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCart = {
        $set: {
          name: cart?.name,
          category: cart?.category,
          description: cart?.description,
          customization: cart?.customization,
          price: cart?.price,
          stockStatus: cart?.stockStatus,
          time: cart?.time,
          photo: cart?.photo,
        },
      };
      const result = await CollectionOfLandscapes.updateOne(
        filter,
        updateCart,
        options
      );
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is connecting..");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
