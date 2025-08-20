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
    const [isHeartActive, setIsHeartActive] = useState(
      favorites[organization.id] ?? isLiked
    );

    useEffect(() => {
    // 현재 찜 상태 반영
    if (favorites[organization.id] !== undefined) {
      setIsHeartActive(favorites[organization.id]);
    }
  }, [favorites, organization.id]);

    const handleClick = async (event) => {
        event.stopPropagation();  // 클릭 이벤트가 부모로 전달 안 됨
        const prevState = isHeartActive;
        try {
          const like_result = await togglelikes(organization.user); // oraganization.id면 안되는 이유? 모르겠음
          if (like_result.status === "liked"){
            setIsHeartActive(true);
            toggleFavorite(organization.id, true);
          } else if (like_result.status === "unliked"){
            setIsHeartActive(false);
            toggleFavorite(organization.id, false);
          }
        } catch (error) {
          console.error("찜 토글 실패:", error);
          setIsHeartActive(prevState);
        }
    }

    return (
        <StyledButton onClick={handleClick}>
            { isHeartActive ? <StyledFaHeart /> : <StyledFaRegHeart />
 }
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
  cursor: pointer;

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
  cursor: pointer;
`;

const StyledButton = styled.button`
  width: 20px;
position: relative;
height: 17px;
border: none;
  background: transparent;
`;