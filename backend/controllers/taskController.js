const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.toggleStatus = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.status = task.status === 'completed' ? 'pending' : 'completed';
  await task.save();
  res.json(task);
};
