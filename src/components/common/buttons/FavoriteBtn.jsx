import React, { useState } from 'react'
import { FaRegHeart as EmptyHeartIcon} from "react-icons/fa6";
import { FaHeart as FilledHeartIcon } from "react-icons/fa6";
import styled from 'styled-components';

const FavoriteBtn = ({onClick}) => {
    const [isHeartActive, setIsHeartActive] = useState(false);

    const handleClick = (event) => {
        event.stopPropagation();  // 클릭 이벤트가 부모로 전달 안 됨
        setIsHeartActive(!isHeartActive);
        if (onClick) {
            onClick(!isHeartActive);
        }
    }

    return (
        <StyledButton onClick={handleClick}>
            { isHeartActive ? <StyledFaHeart /> : <StyledFaRegHeart /> }
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
`;

const StyledButton = styled.button`
  width: 20px;
position: relative;
height: 17px;
border: none;
  background: transparent;
`;