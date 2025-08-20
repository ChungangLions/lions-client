import React from 'react';
import styled from 'styled-components';
import { PiThumbsUpFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa6";

const ICON_MAP = {
  recommend: <PiThumbsUpFill size={20} color={'#AEAEAE'} />,
  favorite: <FaHeart size={20} color={'#AEAEAE'} />,
};

const ShowNum = ({ element, count }) => {
  const displayNum = count > 99 ? "99+" : count;
  const icon = ICON_MAP[element] || null;

  return (
    <Wrapper>
      {<div style={{marginTop: '3px'}}>{icon}</div>}
      <NumberText>{displayNum}</NumberText>
     </Wrapper>
  );
};

export default ShowNum;

const Wrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 5px;
`;


const NumberText = styled.span`
  font-size: 16px;
  color: #AEAEAE;
  font-weight: 400;
`;

// const RecommendIcon = styled(PiThumbsUpFill)`
//   color: #AEAEAE;
//   // width: 24px;
//   // height: 24px;
//   vertical-align: middle;
//   display: flex;
// `;

// const HeartIcon = styled(FaHeart)`
//   color: #AEAEAE;
//   // width: 17px;
//   // height: 17px;
//   vertical-align: middle;
//   display: flex;
// `;
