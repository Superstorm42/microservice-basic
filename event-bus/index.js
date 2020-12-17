const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const axios = require("axios");

app.use(bodyParser.json());
app.use(cors());

const events = [];
app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);
  axios.post("http://localhost:4000/events", event);
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event);
  res.send({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.status(events);
});
app.listen(4005, () => {
  console.log("Listening EVENT-BUS on 4005");
});
