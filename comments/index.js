const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const app = express();
const axios = require("axios");
app.use(bodyParser.json());
app.use(cors());
let commentsByPostId = {};
app.get("/posts/:id/comments", (req, res) => {
  console.log("Came", req.params.id);
  res.status(201).send(commentsByPostId[req.params.id] || []);
});
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const content = req.body.content;
  let comments = commentsByPostId[req.params.id] || [];
  comments.push({
    id: commentId,
    content,
    status: "pending",
  });
  commentsByPostId[req.params.id] = comments;
  console.log(
    "🚀 ~ file: index.js ~ line 23 ~ app.post ~ comments",
    commentsByPostId,
    req.params.id
  );
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });
  res.status(201).send(comments);
});
app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const comments = commentsByPostId[data.postId];
    const comment = comments.find((comment) => {
      return comment.id === data.id;
    });
    comment.status = data.status;
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: comment,
    });
  }
  res.send({});
});
app.listen(4001, () => {
  console.log("Listening COMMENTS on 4001");
});
