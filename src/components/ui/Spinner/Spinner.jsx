import React from 'react';
import { SpinnerRing, SpinnerWrap } from './Spinner.styled';

const Spinner = ({ size = 'md', fullPage = false }) => (
  <SpinnerWrap $fullPage={fullPage}>
    <SpinnerRing $size={size} />
  </SpinnerWrap>
);

export default Spinner;
