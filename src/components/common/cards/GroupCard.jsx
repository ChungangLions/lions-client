import React from 'react';
import styled from 'styled-components';
import FavoriteBtn from '../buttons/FavoriteBtn';
import TypeLabel from '../labels/TypeLabel';
import ShowNum from '../labels/ShowNum';


function GroupCard({ imageUrl, onClick, ButtonComponent, store }) {
    return (
    <CardWrapper onClick={onClick}>
      <ImageWrapper>
        <CardImage src={imageUrl || '/default.png'} alt={store.name} />
        <TypeLabelBox>
          <TypeLabel storeType={store.storeType} background='#BCBCBC'/>
        </TypeLabelBox>
        {/* 아래 onClick은 나중에 서버 연결 후 변경 필요 */}
        <HeartBtnBox>
            {ButtonComponent && <ButtonComponent userId={store.id} />}
        </HeartBtnBox>
        <BestText>Best!</BestText>
      </ImageWrapper>
      <CardTitleRow>
        <CardTitle>{store.name}</CardTitle>
        <ButtonNumbers>
          <ShowNum element='favorite' count={store.likes} />
          <ShowNum element='recommend' count={store.recommendations} />
        </ButtonNumbers>
      </CardTitleRow>
      <CardSubtitle>{store.caption}</CardSubtitle>
    </CardWrapper>
  );
}

export default GroupCard;

const CardWrapper = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 247px;
  margin-bottom: 10px;
`;

const CardImage = styled.img`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 6px 5px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  object-fit: cover;
  background: ${({ src }) =>
    src && src.includes('/default.png') ? '#D9D9D9' : '#fff'};
`;

const TypeLabelBox = styled.div`
  position: absolute;
  left: 14px;
  top: 14px;
`;

const HeartBtnBox = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
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
  height: 24px;
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