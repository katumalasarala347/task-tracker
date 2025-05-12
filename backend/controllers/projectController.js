const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  const count = await Project.countDocuments({ userId: req.userId });
  if (count >= 4) return res.status(400).json({ message: 'Max 4 projects allowed' });

  const project = new Project({ name: req.body.name, userId: req.userId });
  await project.save();
  res.status(201).json(project);
};

exports.getProjects = async (req, res) => {
  const projects = await Project.find({ userId: req.userId });
  res.json(projects);
};
