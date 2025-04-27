import React from 'react';
import { Card } from 'antd';

const TaskCard = ({ task }) => {
  return (
    <div className="mb-4">
      <Card title={task.title} bordered={true}>
        <p><strong>Assigned:</strong> {task.assignedTo?.username || 'Unassigned'}</p>
      </Card>
    </div>
  );
};

export default TaskCard;
