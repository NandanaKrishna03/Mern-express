import { useEffect, useState } from 'react';
import axios from 'axios';
import "./App.css"
function App() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskInput, setEditTaskInput] = useState("");
    const [count, setCount] = useState(0);
    const getTasks = () => {
        axios.get("http://localhost:3007")
            .then(res => {
                setTasks(res.data.taskItems)
                setCount(res.data.count)
            })
            .catch(err => console.error("Error fetching tasks:", err));
    };

    useEffect(() => {
        getTasks();
    }, []);

    const handleAddTask = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3007", { task: taskInput })
            .then(() => {
                setTaskInput("");
                getTasks();
            })
            .catch(err => console.error("Error adding task:", err));
    };

    const handleDeleteTask = (id) => {
        axios.delete(`http://localhost:3007/task/${id}`)
            .then(() => getTasks())
            .catch(err => alert(err.response.data.message));
    };

    const handleEditTask = (task) => {
        setEditTaskId(task._id);
        setEditTaskInput(task.task);
    };

    const handleUpdateTask = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3007/task/${editTaskId}`, { task: editTaskInput })
            .then(() => {
                setEditTaskId(null);
                setEditTaskInput("");
                getTasks();
            })
            .catch(err => console.error("Error updating task:", err));
    };

    return (
        <div className='todolisting'>
        <h2>{count}</h2>
            <h1>Todo</h1>
            <form onSubmit={handleAddTask}>
               <input className='todo-name'
                    type='text'
                    placeholder='Enter task'
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                />
                <input type='submit' value="Add Task" />
            </form>
            <ul className='ordered-list'>
                {tasks.map((task) => (
                    <li key={task._id}>
                        {editTaskId === task._id ? (
                            <form onSubmit={handleUpdateTask}>
                                <input
                                    type="text"
                                    value={editTaskInput}
                                    onChange={(e) => setEditTaskInput(e.target.value)}
                                />
                                <button type="submit">Save</button>
                            </form>
                        ) : (
                            <>
                                {task.task}
                                <button onClick={() => handleEditTask(task)}>Edit</button>
                                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;