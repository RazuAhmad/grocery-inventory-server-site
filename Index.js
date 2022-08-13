const express = require("express");
require("dotenv").config();
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.npcfm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Username: groceryDatabase
// password: ybIc7M61lwH9BuM9

async function run() {
  try {
    const database = client.db("groceryDatabase");
    const itemCollection = database.collection("itemCollection");

    // Find Multiple documents Api

    app.get("/allItems", async (req, res) => {
      const cursor = itemCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // Find Single Documents API
    app.get("/singleItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.findOne(query);
      res.send(result);
    });

    // Post APi
    app.post("/addItems", async (req, res) => {
      const newItem = req.body;
      const result = await itemCollection.insertOne(newItem);
      console.log(
        `A document was inserted with the _id: ${result.insertedId} `
      );
      res.json(result);
    });

    // Delete An Item API
    app.delete("/singleItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });

    // Update Quantity
    app.put("/singleItem/:id", async (req, res) => {
      const id = req.params.id;
      const updatedStuff = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          itemName: updatedStuff.itemName,
          description: updatedStuff.description,
          price: updatedStuff.price,
          quantity: updatedStuff.quantity,
          supplierName: updatedStuff.supplierName,
          imgURL: updatedStuff.imgURL,
        },
      };
      const result = await itemCollection.findOneAndUpdate(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Grocery customer folks!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
