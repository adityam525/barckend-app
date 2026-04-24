var express = require('express');
var router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Auth = require('../middleware/auth');
const Task = require('../models/task');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


/* GET users listing. */
router.post('/', Auth , async function (req, res,) {
  
  try {
    const {prompt} = req.body;

    // const openAiRes = await openai.chat.completions.create({

    //   model : "gpt-4o-mini",
    //   messages : [{
    //     role : "user",
    //     content: `Generate 5 short tasks for: ${prompt}. Return as a JSON array.`
    //   }]

    // })

    
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const result = await model.generateContent(`
    You are a task planner.
    Generate 5 short actionable tasks for: ${prompt}.
    Return ONLY JSON array like:
    ["Task 1", "Task 2"]
    `);

    const text = result.response.text();

    let tasks;
    try {
      tasks = JSON.parse(text);
    } catch {
      tasks = text.split("\n").filter(t => t.trim());
    }

    const savedTasks = [];

    for (let t of tasks) {
      const newTask = await Task.create({
        title: t,
        userId: req.user.userId
      });
      savedTasks.push(newTask);
    }

    res.send({
      messages : "success",
      data: savedTasks
    })
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI error" });
  }

});


module.exports = router;
