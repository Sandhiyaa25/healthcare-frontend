import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons';
import { CardWrap, CardIcon, CardBody, CardLabel, CardValue, TrendBadge, CardGlow } from './StatCard.styled';

const StatCard = ({ label, value, icon, variant = 'primary', trend = 0 }) => {
  const TrendIcon = trend > 0 ? ArrowUpOutlined : trend < 0 ? ArrowDownOutlined : MinusOutlined;
  const trendSign = trend > 0 ? '+' : '';

  return (
    <CardWrap $variant={variant}>
      <CardGlow $variant={variant} />
      <CardIcon $variant={variant}>{icon}</CardIcon>
      <CardBody>
        <CardLabel>{label}</CardLabel>
        <CardValue>{value}</CardValue>
        <TrendBadge $positive={trend > 0} $neutral={trend === 0}>
          <TrendIcon />
          <span>{trend !== 0 ? `${trendSign}${trend}% this month` : 'No change'}</span>
        </TrendBadge>
      </CardBody>
    </CardWrap>
  );
};

export default StatCard;
