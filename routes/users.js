var express = require('express');
var router = express.Router();

const User = require("../models/user");

let idCounter = 3;
let users = [
  { id: 1, name: "Aditya" },
  { id: 2, name: "Rahul" }
];

/* GET users listing. */
router.get('/', async function (req, res,) {
  const users = await User.find();
  res.json({
    success: true,
    data: users
  });
});

/* GET user by id listing. */
router.get('/:id', async function (req, res) {

  const id = req.params.id; // Don't need to parse the id as it is already a string and  User.findById expects a string in it's parameter
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.json({
    success: true,
    data: user
  });

});

/* POST user creation. */
router.post("/", async function (req, res) {
  const { name, id } = req.body;

  if (!name || !id) {
    return res.status(400).json({
      success: false,
      message: "'id' and 'name' are fields required"
    });
  }

  const newUser = await User.create({ id , name });

  res.status(201).json({
    success: true,
    message: "User created",
    data: newUser
  });
});

/* PUT user update */
router.put('/:id', async function (req, res) {

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Name is required"
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User updated",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }

});

/* DELETE */
router.delete("/:id", async (req, res) => {
  
  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "User deleted"
  });
});


module.exports = router;
