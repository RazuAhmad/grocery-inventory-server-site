const express = require("express");
require("dotenv").config();
var cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    // const item = {
    //   itemName: "vegetables",
    //   description:
    //     "this is a good vegetable, all the vegetarian out there can find peace here.",
    //   price: "$89",
    //   quantity: "450kg",
    //   supplierName: "Zawahiri Farm",
    //   imgURL: "https://i.ibb.co/C6MS34x/vegetables-140917-1280.jpg",
    // };

    app.post("/addItems", async (req, res) => {
      const newItem = req.body;
      const result = await itemCollection.insertOne(newItem);
    });

    console.log(`A document was inserted with the _id: ${result.insertedId} `);
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
