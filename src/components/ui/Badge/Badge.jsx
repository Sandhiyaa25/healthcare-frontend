import React from 'react';
import { BadgeEl } from './Badge.styled';

const Badge = ({ children, variant = 'default' }) => (
  <BadgeEl $variant={variant}>{children}</BadgeEl>
);

export default Badge;