import React, { useEffect, useState } from 'react'
import { RiThumbUpLine as EmptyRecommend } from "react-icons/ri";
import { RiThumbUpFill as FilledRecommend } from "react-icons/ri";
import styled from 'styled-components';
import { toggleRecommends } from '../../../services/apis/recommendsapi';

const RecommendBtn = ({ userId, isRecommendActive: defaultActive, onClick }) => {
  const [isRecommendActive, setIsRecommendActive] = useState(defaultActive);

  useEffect(() => {
    setIsRecommendActive(defaultActive);
  }, [defaultActive]); // prop이 바뀌면 변경됨

  const handleClick = async (event) => {
    event.stopPropagation();
    setIsRecommendActive(!isRecommendActive);
    try {
      await toggleRecommends(userId);
    } catch (error) {
      console.error("추천 토글 실패:", error);
      setIsRecommendActive(isRecommendActive);
    }
  };

  return (
    <StyledButton onClick={handleClick}>
      { isRecommendActive ? <StyledRecommend /> : <StyledNotRecommend /> }
    </StyledButton>
  );
};


export default RecommendBtn;

const StyledRecommend = styled(FilledRecommend)`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  color: #64A10F;
`;

const StyledNotRecommend = styled(EmptyRecommend)`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  color: #64A10F;
`;

const StyledButton = styled.button`
  width: 20px;
  position: relative;
  height: 17px;
  border: none;
  background: transparent;
`;