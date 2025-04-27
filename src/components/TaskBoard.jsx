import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import axios from 'axios';

const statuses = ['To Do', 'In Progress', 'Done'];

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('No token found. Authorization denied.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDrop = async (taskId, newStatus) => {
    const updatedTask = tasks.find(task => task._id === taskId);
    if (updatedTask.status !== newStatus) {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { ...updatedTask, status: newStatus });
      fetchTasks();
    }
  };

  return (
    <div className="p-5">
      <Row gutter={16}>
        {statuses.map(status => (
          <Col span={8} key={status}>
            <div className="bg-gray-100 p-3 rounded-md min-h-[500px]">
              <h2 className="text-center font-bold text-lg mb-2">{status}</h2>
              <TaskColumn
                status={status}
                tasks={tasks.filter(task => task.status === status)}
                onDrop={handleDrop}
              />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const TaskColumn = ({ status, tasks, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => onDrop(item.id, status),
    canDrop: () => true,
  });

  return (
    <div ref={drop} className={`min-h-[400px] p-2 ${isOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
      {tasks.map(task => (
        <DraggableTask key={task._id} task={task} />
      ))}
    </div>
  );
};

const DraggableTask = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className={`mb-2 cursor-pointer ${isDragging ? 'opacity-50' : ''}`}>
      <Card title={task.title} className="p-3">
        <p><b>Assigned to:</b> {task.assignedTo}</p>
        <p>{task.description}</p>
      </Card>
    </div>
  );
};

export default TaskBoard;
