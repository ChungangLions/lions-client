import React, { useEffect, useState } from 'react'
import { FaRegHeart as EmptyHeartIcon} from "react-icons/fa6";
import { FaHeart as FilledHeartIcon } from "react-icons/fa6";
import styled from 'styled-components';
import { toggleLikes} from '../../../services/apis/likesapi';


const FavoriteBtn = ({ userId, isLikeActive: defaultActive, onClick }) => {
  console.log(defaultActive);

    const [isLikeActive, setIsLikeActive] = useState(defaultActive);

    useEffect(() => {
      setIsLikeActive(defaultActive);
    }, [defaultActive]); // prop이 바뀌면 변경됨

    const handleClick = async (event) => {
        event.stopPropagation();  // 클릭 이벤트가 부모로 전달 안 됨
        setIsLikeActive(!isLikeActive);
        
        try {
          await toggleLikes(userId);
        } catch (error) {
          console.error("토글 실패:", error);
          setIsLikeActive(isLikeActive);
        }
      };


    return (
        <StyledButton onClick={handleClick}>
            { isLikeActive ? <StyledFaHeart /> : <StyledFaRegHeart /> }
        </StyledButton>
    )
  
}

export default FavoriteBtn;

const StyledFaHeart = styled(FilledHeartIcon)`
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
  color: #64A10F ;
`;

const StyledFaRegHeart = styled(EmptyHeartIcon)`
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