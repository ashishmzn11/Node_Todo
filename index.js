import express from "express";
import path from "path";
import { MongoClient } from "mongodb";

const dbName = "Node-Todo";
const collectionName = "Todo";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const connectDB = async () => {
  await client.connect();
  return client.db(dbName);
};


const app = express();
const publicpath = path.resolve("public");
app.use(express.static(publicpath));

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./view");

app.get("/", (req, res) => {
  res.render("list");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.post("/add", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    if (result.insertedId) {
      res.redirect("/");
    } else {
      res.redirect("/add");
    }
  } catch (err) {
    console.error(err);
    res.redirect("/add");
  }
});

app.post("/update", (req, res) => {
  res.redirect("/");
});

app.listen(3200, () => {
  console.log("Server running on http://localhost:3200");
});
