const express = require("express");

const server = express();

const userRouter = require("./users/userRouter");

//custom middleware
function logger(req, res, next) {
  console.log(req.method);
  console.log(req.url);
  console.log(Date.now());
  next();
}

server.use(logger);
server.use(express.json());
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
