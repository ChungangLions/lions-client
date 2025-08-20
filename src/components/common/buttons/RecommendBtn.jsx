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
  height: 17px;
  width: 17px;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  color: #64A10F;
`;

const StyledNotRecommend = styled(EmptyRecommend)`
  height: 17px;
  width: 17px;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  color: #64A10F;
`;

const StyledButton = styled.button`
  position: relative;
  border: none;

  border-radius: 18.5px;
  background: #FFF;
  display: flex;
  width: 37px;
  height: 37px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;