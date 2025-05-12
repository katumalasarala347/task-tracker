import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [projectName, setProjectName] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', status: 'pending' });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired');
        navigate('/login');
      }
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev => ({ ...prev, [projectId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/projects`, { name: projectName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectName('');
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating project');
    }
  };

  const handleTaskSubmit = async (e, projectId) => {
    e.preventDefault();
    const { title, description } = e.target.elements;
    try {
      await axios.post(`${API_URL}/api/tasks`, {
        title: title.value,
        description: description.value,
        projectId,
        status: 'pending',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(projectId);
      e.target.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId, projectId) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(projectId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkDone = async (taskId, projectId) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${taskId}`, { status: 'completed' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(projectId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (task) => {
    setEditTaskId(task._id);
    setEditFormData({ title: task.title, description: task.description, status: task.status });
  };

  const handleEditSubmit = async (e, taskId, projectId) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/tasks/${taskId}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditTaskId(null);
      setEditFormData({ title: '', description: '', status: 'pending' });
      fetchTasks(projectId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleProjectSubmit} className="mb-6 flex flex-col sm:flex-row gap-2">
          <input
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            placeholder="New Project Name"
            className="flex-1 border border-gray-300 px-3 py-2 rounded"
            required
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Add Project
          </button>
        </form>

        {projects.map(project => (
          <div key={project._id} className="mb-8 p-4 border rounded bg-white shadow">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">{project.name}</h2>

            <form onSubmit={e => handleTaskSubmit(e, project._id)} className="flex flex-col sm:flex-row gap-2 mb-4">
              <input name="title" placeholder="Task Title" className="flex-1 border px-3 py-2 rounded" required />
              <input name="description" placeholder="Description" className="flex-1 border px-3 py-2 rounded" required />
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                Add Task
              </button>
            </form>

            <button
              onClick={() => fetchTasks(project._id)}
              className="text-sm text-blue-500 underline mb-2"
            >
              Load Tasks
            </button>

            <ul className="space-y-2">
              {(tasks[project._id] || []).map(task => (
                <li key={task._id} className="flex flex-col gap-2 bg-gray-100 p-2 rounded">
                  {editTaskId === task._id ? (
                    <form onSubmit={(e) => handleEditSubmit(e, task._id, project._id)} className="flex flex-col gap-2">
                      <input
                        value={editFormData.title}
                        onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                        className="border p-1 rounded"
                        required
                      />
                      <input
                        value={editFormData.description}
                        onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                        className="border p-1 rounded"
                        required
                      />
                      <select
                        value={editFormData.status}
                        onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                        className="border p-1 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span>
                        <strong>{task.title}</strong> - {task.status}
                      </span>
                      <div className="flex gap-2">
                        {task.status !== 'completed' && (
                          <button
                            onClick={() => handleMarkDone(task._id, project._id)}
                            className="text-green-600 hover:underline"
                          >
                            Mark Done
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(task)}
                          className="text-yellow-600 hover:underline"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id, project._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
