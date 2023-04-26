const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const port = 8000;
const url = "mongodb+srv://sahil:sahil231@cluster0.lsqnrpc.mongodb.net/test";

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(url);
  console.log("Database connected!");
}

// Schema
const companySchema = new Schema({
  name: String,
  primaryText: String,
  headline: String,
  description: String,
  image: String,
});

// model
const Company = new mongoose.model("Company", companySchema);

app.post("/company", async (req, res) => {
  try {
    let company = new Company({
      name: "Nike",
      primaryText:
        "Nike delivers innovative products, experiences and services to inspire athletes. Buy sports shoes, training shoes, running shoes, football & futsal shoes online.",
      headline: "Just do it.",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: "nike.jpg",
    });
    const savedCompany = await company.save();
    res.send(savedCompany);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.post("/searchAds", async (req, res) => {
  try {
    const keyword = req.body.keyword;
    if (!keyword) {
      return res.status(400).send({
        status: false,
        message: "Please provide a valid search keyword!",
      });
    }
    const result = await Company.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { primaryText: { $regex: keyword, $options: "i" } },
            { headline: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        },
      },
    ]);
    res.status(200).send({ status: true, ad: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: false,
      message: "An error occurred while searching for ads!",
    });
  }
});

app.listen(port, function () {
  console.log(`Server is running at ${port}`);
});
