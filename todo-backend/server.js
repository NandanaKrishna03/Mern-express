const express = require('express')
const app = express()
var cors=require('cors')
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? 'https://mern-express-front.onrender.com'
    : 'http://localhost:5173';

app.use(cors({ origin: allowedOrigins }));



const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config('./.env');
const dbPassword=process.env.DB_PASSWORD
console.log(dbPassword);
mongoose.connect(`mongodb+srv://nandanakrishna75:${dbPassword}@main.4ibgw.mongodb.net/?retryWrites=true&w=majority&appName=main`)

.then(res=>{
    console.log("db connected successfully");
    
})
.catch(err=>{
console.log("db connection failed")

})
const TaskSchema = new mongoose.Schema({
    task: String,
    isCompleted:Boolean
  });
  const Task = mongoose.model('task', TaskSchema);
app.use(express.json())
let tasks=[
   
]
app.get('/', (req, res) => { 
  Task.find() 
  .then(taskItems=>{
    console.log(taskItems);
  res.json({taskItems,count:taskItems.length})
  })
  .catch(err=>{

  })
 
})
const { v4: uuidv4 } = require('uuid');
app.post('/', (req, res) => { 
    console.log(req.body)
    const task=req.body.task
    Task.create({task:task, isCompleted:false})
    res.json("success")
  })
app.delete("/task/:id", (req, res) => {

    Task.findByIdAndDelete(req.params.id)
    .then(data=>{
     
    res.send("deleted")
    })
    .catch(err=>{
  res.status(404).json({ message: "Task not found" });
    })
});

   app.put('/task/:id', (req, res) => {
    const { id } = req.params; // Extract the task ID from the URL
    const { task } = req.body; 
    Task.findByIdAndUpdate(id, { task}, {new:true})
    .then(updatedTask=>{
      if (updatedTask) {
        res.json({ message: "Task updated successfully", task: updatedTask });
    } else {
        res.status(404).json({ message: "Task not found" });
    }
})
.catch(err => {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Error updating task" });
});
});
    
    
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
