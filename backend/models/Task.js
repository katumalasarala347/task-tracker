const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
