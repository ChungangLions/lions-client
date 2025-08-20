import React, { useEffect, useState } from 'react'
import { FaRegHeart as EmptyHeartIcon} from "react-icons/fa6";
import { FaHeart as FilledHeartIcon } from "react-icons/fa6";
import styled from 'styled-components';
import { togglelikes } from '../../../services/apis/likesapi';
import useUserStore from '../../../stores/userStore';
import useOwnerProfile from '../../../hooks/useOwnerProfile';
import useFavoriteStore from '../../../stores/favoriteStore';


const FavoriteBtn = ({ organization, isLiked = false, onToggle }) => {
    const { favorites, toggleFavorite } = useFavoriteStore();
    const [isHeartActive, setIsHeartActive] = useState(isLiked);

    useEffect(() => {
        setIsHeartActive(isLiked);
    }, [isLiked]);

    // favoriteStore이랑 동기화
    useEffect(() => {
        if (favorites[organization.id] !== undefined) {
            setIsHeartActive(favorites[organization.id]);
        }
    }, [favorites, organization.id]);

    const handleClick = async (event) => {
        event.stopPropagation();  // 클릭 이벤트가 부모로 전달 안 됨
        const prevState = isHeartActive;
        
        const newState = !isHeartActive;
        setIsHeartActive(newState);
        toggleFavorite(organization.id, newState);
        
        try {
            const like_result = await togglelikes(organization.user);
            console.log("찜 토글 결과:", like_result); // 응답 status : liked, unliked
            
            if (like_result.status === "liked" && !newState) {
                setIsHeartActive(true);
                toggleFavorite(organization.id, true);
                onToggle && onToggle(true);
            } else if (like_result.status === "unliked" && newState) {
                // API는 unliked인데 로컬은 true로 설정했으면 다시 false로
                setIsHeartActive(false);
                toggleFavorite(organization.id, false);
                onToggle && onToggle(false);
            } else {
                // API 응답과 로컬 상태가 일치하면 onToggle 호출
                onToggle && onToggle(newState);
            }
        } catch (error) {
            console.error("찜 토글 실패:", error);
            // 에러 시 이전 토글 해제
            setIsHeartActive(prevState);
            toggleFavorite(organization.id, prevState);
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
  color: #898989;
  
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