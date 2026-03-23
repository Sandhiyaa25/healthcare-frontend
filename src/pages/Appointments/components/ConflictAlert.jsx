import React from 'react';
import { Alert } from 'antd';
import { formatDate } from '../../../utils/dateUtils';

const ConflictAlert = ({ conflict }) => {
  if (!conflict) return null;
  const start = conflict.start_time?.slice(0, 5);
  const end   = conflict.end_time?.slice(0, 5);
  return (
    <Alert
      type="warning"
      showIcon
      style={{ marginBottom: 16 }}
      message="Scheduling Conflict Detected"
      description={`Doctor already has an appointment on ${formatDate(conflict.date)} from ${start} to ${end}. Please choose a different time.`}
    />
  );
};

export default ConflictAlert;
