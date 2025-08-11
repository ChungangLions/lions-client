import React from 'react';
import styled from 'styled-components';
import FavoriteNum from '../result/FavoriteNum';
import RecommendNum from '../result/RecommendNum';
import FavoriteBtnSolo from '../buttons/FavoriteBtnSolo';
import TypeLabel from '../result/TypeLabel';

function GroupCard({ imageUrl, title, subtitle, type, favorite, recommend, like, onLikeClick, best }) {
    return (
    <CardWrapper>
      <ImageWrapper>
        <CardImage src={imageUrl || '/default.png'} alt={title} />
        <TypeLabelBox>
          <TypeLabel type={type} />
        </TypeLabelBox>
        {/* 아래 onClick은 나중에 서버 연결 후 변경 필요 */}
        <HeartBtnBox>
            <FavoriteBtnSolo 
                like={like}
                onClick={onLikeClick}    
            />
        </HeartBtnBox>
        {best && (<BestText>Best!</BestText>)}
      </ImageWrapper>
      <CardTitleRow>
        <CardTitle>{title}</CardTitle>
        <ButtonNumbers>
            <FavoriteNum favorite={favorite} />
            <RecommendNum recommend={recommend} />
        </ButtonNumbers>
      </CardTitleRow>
      <CardSubtitle>{subtitle}</CardSubtitle>
    </CardWrapper>
  );
}

export default GroupCard;

const CardWrapper = styled.div`
  display: flex;
  width: 330px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const ImageWrapper = styled.div`
    display: flex;
    width: 100%;
    position: relative;
    height: 247px;
    margin-bottom: 10px;
`;

const CardImage = styled.img`
  display: flex;
  height: 247px;
  width: 330px;
  padding: 6px 5px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  object-fit: cover;
  background: #D9D9D9;
`;

const TypeLabelBox = styled.div`
  position: absolute;
  left: 14px;
  top: 14px;
`;

const HeartBtnBox = styled.div`
  position: absolute;
  right: 18px;
  top: 14px;
`;

const BestText = styled.div`
  position: absolute;
  left: 14px;
  top: 60px;
  color: #000;
  font-weight: 400;
  font-size: 16px;
`;

const CardTitleRow = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 10px; 
`;

const CardTitle = styled.div`
    color: #000;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const ButtonNumbers = styled.div`
    display: flex;
    gap: 10px;
    align-items:center;
`;

const CardSubtitle = styled.div`
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;