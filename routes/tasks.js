var express = require('express');
var router = express.Router();

const Task = require("../models/task");
const auth = require("../middleware/auth")


router.post("/",auth, async (req, res , next)=>{
  const task = await Task.create({
    title: req.body.title,
    userId : req.user.userId,
  })

  res.json(task);
})


router.get('/',auth, async(req, res, next)=>{
  const tasks = await Task.find({userId : req.user.userId})
  res.json(tasks);
})


router.put('/:id', auth, async(req, res)=>{

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {title : req.body.title},
    {new : true}
  )

  res.json(task)
})


router.delete('/:id', auth, async (req, res)=>{

  await Task.findByIdAndDelete(req.params.id)
  
  res.json({message : 'DELETED'})
})

module.exports = router;