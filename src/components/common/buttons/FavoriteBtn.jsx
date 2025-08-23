import React, { useEffect, useState } from 'react'
import { FaRegHeart as EmptyHeartIcon} from "react-icons/fa6";
import { FaHeart as FilledHeartIcon } from "react-icons/fa6";
import styled from 'styled-components';
import { toggleLikes} from '../../../services/apis/likesapi';
import { ReactComponent as HeartIcon } from "../../../assets/images/icons/HeartIcon.svg";
import { ReactComponent as ActiveHeartIcon } from "../../../assets/images/icons/FilledHeart.svg";

const FavoriteBtn = ({ userId, isLikeActive: defaultActive, onClick, customColor, useCustomIcon, onLikeChange }) => {
  // console.log(defaultActive);

    const [isLikeActive, setIsLikeActive] = useState(defaultActive);

    useEffect(() => {
      setIsLikeActive(defaultActive);
    }, [defaultActive]); // prop이 바뀌면 변경됨

    const handleClick = async (event) => {
        event.stopPropagation();  // 클릭 이벤트가 부모로 전달 안 됨
        const newState = !isLikeActive;
        setIsLikeActive(newState);
        
        try {
          await toggleLikes(userId);
          // 찜 상태 변경 성공 시 부모 컴포넌트에게 알림
          if (onLikeChange) {
            onLikeChange(userId, newState);
          }
        } catch (error) {
          console.error("토글 실패:", error);
          setIsLikeActive(!newState); // 이전 상태로 되돌리기
        }
      };


    return (
        <StyledButton onClick={handleClick}>
            { isLikeActive 
              ? (useCustomIcon ? <StyledGrayHeart $customColor={customColor} /> : <StyledFaHeart $customColor={customColor} />)
              : (useCustomIcon ? <StyledEmptyHeart $customColor={customColor} /> : <StyledFaRegHeart $customColor={customColor} />)
            }
        </StyledButton>
    )
  
}

export default FavoriteBtn;

const StyledFaHeart = styled(FilledHeartIcon)`
  width: 20px;
  height: 17px;
  color: ${props => props.$customColor || '#64A10F'};
`;

const StyledFaRegHeart = styled(EmptyHeartIcon)`
  width: 20px;
  height: 17px;
  color: ${props => props.$customColor || '#64A10F'};
`;

const StyledGrayHeart = styled(ActiveHeartIcon)`
  width: 20px;
  height: 17px;
  cursor: pointer;
`;

const StyledEmptyHeart = styled(HeartIcon)`
  width: 20px;
  height: 17px;
  cursor: pointer;
`;

const StyledButton = styled.button`
  width: 32px;
  height: 32px;
  position: relative;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;