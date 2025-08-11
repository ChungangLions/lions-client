import React from 'react';
import styled from 'styled-components';

const FavoriteNum = ({ favorite }) => {
  const displayNum = favorite > 99 ? "99+" : favorite;

  return (
    <Wrapper>
      <HeartIcon>♥</HeartIcon>
      <FavoriteText>{displayNum}</FavoriteText>
    </Wrapper>
  );
};

export default FavoriteNum;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const HeartIcon = styled.span`
  color: black;
  font-size: 20px; // 아마 사이즈 안 맞음! 폰트 아니고 vector 기준이어서
  vertical-align: middle;
`;

const FavoriteText = styled.span`
  font-size: 16px;
  color: #000000;
  font-weight: 400;
`;