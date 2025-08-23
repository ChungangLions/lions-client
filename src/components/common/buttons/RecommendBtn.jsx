import React, { useEffect, useState } from 'react'
import { RiThumbUpLine as EmptyRecommend } from "react-icons/ri";
import { RiThumbUpFill as FilledRecommend } from "react-icons/ri";
import styled from 'styled-components';
import { toggleRecommends } from '../../../services/apis/recommendsapi';

const RecommendBtn = ({ userId, isRecommendActive: defaultActive, onClick, height = '17px', onRecommendChange }) => {
  const [isRecommendActive, setIsRecommendActive] = useState(defaultActive);

  useEffect(() => {
    setIsRecommendActive(defaultActive);
  }, [defaultActive]); // prop이 바뀌면 변경됨

  const handleClick = async (event) => {
    event.stopPropagation();
    const newState = !isRecommendActive;
    setIsRecommendActive(newState);
    
    try {
      await toggleRecommends(userId);
      // 추천 상태 변경 성공 시 부모 컴포넌트에게 알림
      if (onRecommendChange) {
        onRecommendChange(userId, newState);
      }
    } catch (error) {
      console.error("추천 토글 실패:", error);
      setIsRecommendActive(isRecommendActive); // 실패 시 원래 상태로 복원
    }
  };

  return (
    <StyledButton onClick={handleClick}>
      { isRecommendActive ? <StyledRecommend height={height}/> : <StyledNotRecommend $height={height}/> }
    </StyledButton>
  );
};


export default RecommendBtn;

const StyledRecommend = styled(FilledRecommend)`
  height: ${(props) => props.height || "17px"};
  width: 100%;
  overflow: hidden;
  max-height: 100%;
  color: #64A10F;
`;

const StyledNotRecommend = styled(EmptyRecommend)`
  height: ${(props) => props.height || "17px"};
  width: 100%;
  overflow: hidden;
  max-height: 100%;
  color: #64A10F;
`;

const StyledButton = styled.button`
  // width: 32px;
  // height: 32px;
  position: relative;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  // border-radius: 18.5px;
  // background: #FFF;
  // display: flex;
  // width: 37px;
  // height: 37px;
  // padding: 10px;
  // justify-content: center;
  // align-items: center;
  // gap: 10px;
`;