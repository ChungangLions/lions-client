import React from 'react'
import styled from 'styled-components';

const RecommendNum = ({ recommend }) => {
  const displayNum = recommend > 99 ? "99+" : recommend;

  return (
    <Wrapper>
        {/* 따봉 아이콘 나중에 바꿔야 할 듯.. ^^ */}
      <RecommendIcon>👍</RecommendIcon> 
      <RecommendText>{displayNum}</RecommendText>
    </Wrapper>
  );
};

export default RecommendNum;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RecommendIcon = styled.span`
  color: black;
  font-size: 20px;
  vertical-align: middle;
`;

const RecommendText = styled.span`
  font-size: 16px;
  color: #000000;
  font-weight: 400;
`;