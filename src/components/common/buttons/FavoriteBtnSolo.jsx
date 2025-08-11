import React, { useState } from 'react';
import styled from 'styled-components';

function FavoriteBtnSolo({ like = false, onClick }) {
  return (
    <HeartButton aria-label="찜하기" onClick={onClick}>
      {like ? (
        <HeartIconActive>♥</HeartIconActive>
      ) : (
        <HeartIconInactive>♡</HeartIconInactive>
      )}
    </HeartButton>
  );
}

export default FavoriteBtnSolo;

const HeartButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
`;

const HeartIconActive = styled.span`
  font-size: 24px; // font-size 조정 필요
  color: black;
  transition: color 0.2s;
`;

const HeartIconInactive = styled.span`
  font-size: 20px; // font-size 조정 필요
  color: black;
  transition: color 0.2s;
`;