import React from 'react';
import { Tag } from 'antd';

const STATUS_CONFIG = {
  scheduled: { color: 'blue',   label: 'Scheduled' },
  confirmed: { color: 'green',  label: 'Confirmed' },
  completed: { color: 'cyan',   label: 'Completed' },
  cancelled: { color: 'red',    label: 'Cancelled' },
  no_show:   { color: 'orange', label: 'No Show'   },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { color: 'default', label: status || '—' };
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
};

export default StatusBadge;
