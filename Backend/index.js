const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const url = "mongodb://127.0.0.1:27017";
const database = "TechForNepal";
const port = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function withDB(callback) {
  try {
    await client.connect();
    const db = client.db(database);
    await callback(db);
  } finally {
    await client.close();
  }
}

app.get("/getalldata", async (request, response) => {
  try {
    await withDB(async (db) => {
      const collection = db.collection("Blogs");
      const allData = await collection.find().toArray();
      response.json(allData);
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addcommentdata", async (request, response) => {
  try {
    const newData = request.body;
    await withDB(async (db) => {
      const collection = db.collection("comments");
      const result = await collection.insertOne(newData);
      const insertedData = await collection.findOne({ _id: result.insertedId });
      response.json({ message: "Data added successfully", result: insertedData });
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addblogdata", async (request, response) => {
  try {
    const newData = request.body;
    await withDB(async (db) => {
      const collection = db.collection("Blogs");
      const result = await collection.insertOne(newData);
      const insertedData = await collection.findOne({ _id: result.insertedId });
      response.json({ message: "Data added successfully", result: insertedData });
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/htmlpage", (request, response) => {
  response.sendFile(__dirname + "/htmlpage.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
