const express = require("express");
const User = require("./userDb");
const Post = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  // do your magic!
  try {
    const newUser = await User.insert(req.body);
    res.status(201).json(newUser);
  } catch {
    res.status(500).json({ message: "There was an error creating user" });
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  // do your magic!
  const { id } = req.params;
  try {
    const newPost = await Post.insert({ ...req.body, user_id: id });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({
      message: "There was an error creating post",
      error: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  // do your magic!
  try {
    const users = await User.get();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "There was an error getting user data",
      error: err.message,
    });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  // do your magic!
  const { id } = req.params;
  try {
    const posts = await User.getUserPosts(id);
    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: "There was an error getting posts" });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  // do your magic!
  const { id } = req.params;
  try {
    const deletedPost = await User.getById(id);
    const deletedConfirm = await User.remove(id);
    res.status(200).json(deletedPost);
  } catch {
    res.status(500).json({ message: "User could not be removed" });
  }
});

router.put("/:id", validateUserId, async (req, res) => {
  // do your magic!
  const { id } = req.params;

  try {
    const updated = await User.update(id, req.body);
    const changedUser = await User.getById(id);
    res.status(200).json(changedUser);
  } catch {
    res.status(500).json({ message: "User could not be updated" });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;

  try {
    const checkedUser = await User.getById(id);

    if (!checkedUser) {
      res.status(404).json({ message: "a user with this id does not exist" });
    } else {
      req.user = checkedUser;
      next();
    }
  } catch {
    res.status(500).json({ message: "error retrieving user" });
  }
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "name field is required" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "text field is required" });
  } else {
    next();
  }
}

module.exports = router;
