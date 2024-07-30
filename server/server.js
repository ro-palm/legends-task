const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/taskmanager', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  tasks: [{
    name: String,
    description: String,
    status: String,
    dueDate: String
  }]
});

const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password, tasks: [] });
  try {
    await user.save();
    res.status(201).json({ message: 'User signed up', user });
  } catch (error) {
    res.status(400).json({ message: 'Sign up failed', error });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({ message: 'User logged in', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
});

app.get('/tasks', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ tasks: user.tasks });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
});

app.post('/tasks', async (req, res) => {
  const { email, task } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.tasks.push(task);
      await user.save();
      res.status(200).json({ message: 'Task added', tasks: user.tasks });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to add task', error });
  }
});

app.put('/tasks', async (req, res) => {
  const { email, task } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const taskIndex = user.tasks.findIndex(t => t._id.toString() === task._id);
      if (taskIndex !== -1) {
        user.tasks[taskIndex] = task;
        await user.save();
        res.status(200).json({ message: 'Task updated', tasks: user.tasks });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
});

app.delete('/tasks', async (req, res) => {
  const { email, taskId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.tasks = user.tasks.filter(task => task._id.toString() !== taskId);
      await user.save();
      res.status(200).json({ message: 'Task deleted', tasks: user.tasks });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
