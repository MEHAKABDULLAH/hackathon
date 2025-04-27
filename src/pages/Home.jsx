import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';

const statuses = ['To Do', 'In Progress', 'Done'];

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTask, setEditingTask] = useState(null);  // To track which task we are editing

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('No token found. Authorization denied.');
      return;
    }

    try {
      console.log('Fetching tasks...');
      const res = await axios.get('https://backendd-one.vercel.app/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Tasks fetched:', res.data); // Log the fetched tasks
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle task status update in backend
  const updateTaskStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('No token found. Authorization denied.');
      return;
    }

    try {
      const updatedTask = tasks.find(task => task._id === taskId);
      if (updatedTask.status !== newStatus) {
        console.log('Updating task status...', updatedTask, 'New Status:', newStatus); // Log before updating
        await axios.put(
          `https://backendd-one.vercel.app/api/tasks/${taskId}`,
          { ...updatedTask, status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(prevTasks => prevTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        ));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Handle task form submission
  const handleAddOrUpdateTask = async (values) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('No token found. Authorization denied.');
      return;
    }

    console.log('Adding/updating task with values:', values);
  

    try {
      // Fetch user by username (this should be part of your backend logic)
      const userRes = await axios.get(`https://backendd-one.vercel.app//api/users/username/${values.assignedTo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = userRes.data._id; // Assuming userRes.data._id is the user ID from your backend

      // Update values to include the user ID
      const taskData = { ...values, assignedTo: userId };

      if (editingTask) {
        // Update existing task
        await axios.put(`https://backendd-one.vercel.app/api/tasks/${editingTask._id}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(prevTasks => prevTasks.map(task =>
          task._id === editingTask._id ? { ...task, ...taskData } : task
        ));
        window.alert('Task updated successfully!');
      } else {
        // Add new task
        const newTask = await axios.post('https://backendd-one.vercel.app/api/tasks', taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('New task added:', newTask.data);
        window.alert('Task added successfully!');
        setTasks(prevTasks => [...prevTasks, newTask.data]);
      }

      setIsModalVisible(false); // Close modal after submission
      setEditingTask(null); // Reset editing task state
    } catch (error) {
      console.error('Error adding or updating task:', error);
    }
  };

  // Show task form modal for adding new task or editing existing task
  const showModal = (task = null) => {
    setIsModalVisible(true);
    setEditingTask(task);
    if (task) {
      // Pre-fill the form with the task data for editing
      form.setFieldsValue({
        title: task.title,
        assignedTo: task.assignedTo?.username || '',  // Assuming username is stored here
        status: task.status,
      });
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('No token found. Authorization denied.');
      return;
    }

    try {
      await axios.delete(`https://backendd-one.vercel.app/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      window.alert('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Close task form modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTask(null); // Reset editing task state
  };

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 20 }}>
        Add Task
      </Button>

      <Row gutter={16}>
        {statuses.map(status => (
          <Col span={8} key={status}>
            <div style={{
              background: '#f0f2f5',
              padding: 16,
              borderRadius: 8,
              minHeight: '500px',
            }}>
              <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 16 }}>
                {status}
              </h2>

              {/* Render tasks for the specific status */}
              <div>
                {tasks.filter(task => task.status === status).map(task => (
                  <Card
                    key={task._id}
                    title={task.title}
                    extra={
                      <>
                        <Button
                          type="primary"
                          onClick={() => showModal(task)}  // Open modal for editing
                          style={{ marginRight: 8 }}
                        >
                          Update
                        </Button>
                        <Button
                          type="danger"
                          onClick={() => handleDeleteTask(task._id)} // Delete task
                        >
                          Delete
                        </Button>
                      </>
                    }
                  >
                    <p>Assigned To: {task.assignedTo ? task.assignedTo.username : 'No data'}</p> {/* Display assigned user or "No data" */}
                  </Card>
                ))}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Task form modal */}
      <Modal
        title={editingTask ? 'Edit Task' : 'Add Task'}
        open={isModalVisible} // Changed from 'visible' to 'open'
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdateTask}
        >
          <Form.Item
            label="Task Title"
            name="title"
            rules={[{ required: true, message: 'Please enter task title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Assigned To"
            name="assignedTo"
            rules={[{ required: true, message: 'Please enter a username or user ID' }]}
          >
            <Input placeholder="Enter username or user ID" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            initialValue="To Do"
          >
            <Select>
              <Select.Option value="To Do">To Do</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Done">Done</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home;
