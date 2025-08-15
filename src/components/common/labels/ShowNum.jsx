import React from 'react';
import styled from 'styled-components';
import { PiThumbsUpFill as RecommendIcon } from "react-icons/pi";
import { FaHeart as HeartIcon } from "react-icons/fa6";

const ICON_MAP = {
  recommend: <RecommendIcon />,
  favorite: <HeartIcon />,
};

const ShowNum = ({ element, count }) => {
  const displayNum = count > 99 ? "99+" : count;
  const icon = ICON_MAP[element] || null;

  return (
    <Wrapper>
      <IconSpan>{icon}</IconSpan>
      <NumberText>{displayNum}</NumberText>
    </Wrapper>
  );
};

export default ShowNum;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  gap: 5px;
`;

const IconSpan = styled.span`
  color: #AEAEAE;
  width: 17px;
  height: 17px;
  vertical-align: middle;
  display: flex;
`;

const NumberText = styled.span`
  font-size: 16px;
  color: #AEAEAE;
  font-weight: 400;
`;
