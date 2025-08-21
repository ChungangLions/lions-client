import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { FaRegHeart as EmptyHeartIcon} from "react-icons/fa6";
import { FaHeart as FilledHeartIcon } from "react-icons/fa6";
import styled from 'styled-components';
import { togglelikes } from '../../../services/apis/likesapi';
import useUserStore from '../../../stores/userStore';
import useOwnerProfile from '../../../hooks/useOwnerProfile';
import useFavoriteStore from '../../../stores/favoriteStore';


const FavoriteBtn = ({ organization, isLiked = false, onToggle }) => {

    const { favorites, toggleFavorite } = useFavoriteStore();


    const isHeartActive = favorites[organization.id] || false;
 
    const handleClick = async (event) => {
        event.stopPropagation();  // 클릭 이벤트가 부모로 전달 안 됨
        const prevState = isHeartActive;
        
        const newState = !isHeartActive;
        onToggle && onToggle(newState);

        toggleFavorite(organization.id, newState);
        
        try {
            const targetUserId = organization?.user;
            console.log('찜 토글 target userId:', targetUserId, 'org:', organization);
            if (!targetUserId) throw new Error('학생단체 user id가 비어있습니다.');

            const like_result = await togglelikes(targetUserId);
            console.log("찜 토글 결과:", like_result); // 응답 status : liked, unliked
            
            if ((String(like_result.status).toLowerCase() === "liked" && !newState) || (String(like_result.status).toLowerCase() === "unliked" && newState))
                 {
                toggleFavorite(organization.id, false);
                onToggle && onToggle(false);
            } else {
                onToggle && onToggle(newState);
            }
        } catch (error) {
            console.error("찜 토글 실패:", error);
            toggleFavorite(organization.id, prevState);
        }
    };

    return (
        <StyledButton onClick={handleClick}>
            { isHeartActive ? <StyledFaHeart /> : <StyledFaRegHeart /> }
        </StyledButton>
    )

};

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
  color: #64A10F;
  cursor: pointer;
  &:hover {
    fill: #E9F4D0;    
    stroke: #64A10F; 
  }
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
  color: #70AF19;
  
  cursor: pointer;
  &:hover {
  stroke: #898989; 
    fill: #E9F4D0;    
`;

const StyledButton = styled.button`
  width: 20px;
position: relative;
height: 17px;
border: none;
  background: transparent;
`;