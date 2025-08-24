import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TypeLabel from '../components/common/labels/TypeLabel';

function ProposalCard({ imageUrl, onClick, store }) {


  useEffect(() => {
    const fetchProfile = async () => { 
      try {
        const storeId = store.id;
      } catch (error) {
        console.error("프로필 데이터 조회 실패:", error);
      }
    };
    fetchProfile();
  }, []);

    return (
    <CardWrapper onClick={onClick}>
      <ImageWrapper>
        <CardImage src={imageUrl || '/default.png'} alt={store.name} />
      </ImageWrapper>
      <DetailSection>
        <CardTitleRow>
          <Row>
            <CardTitle>{store.profile_name}</CardTitle>
          </Row>
          <CardSubtitle>{store.comment}</CardSubtitle>
        </CardTitleRow>
        <TypeWrapper>
          <TypeLabel storeType={store.business_type} background='#E9F4D0'/>
        </TypeWrapper>
      </DetailSection>
    </CardWrapper>
  );
}

export default ProposalCard;

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
  // height: 100%;
  aspect-ratio: 10/7.5;
  position: relative;
  min-height: 247px;
  // margin-bottom: 10px;
  border-radius: 5px;
  // border: 1px solid black
`;

const CardImage = styled.img`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  object-fit: cover;
  background: ${({ src }) =>
    src && src.includes('/default.png') ? '#D9D9D9' : '#fff'};
  border-radius: 5px;
`;

const HeartBtnBox = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;

  display: flex;
  width: 20px;
  height: 20px;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  background: #FFF;
`;

const BestText = styled.div`
display: flex;
padding: 0 5px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 30px;
border: 1px solid #70AF19;
color: #70AF19;
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
margin-top: 5px;
`;

const CardTitleRow = styled.div`
  display: flex;
  flex-direction: column; 
  width: 100%;
  align-items: flex-start;
  justify-content: start;
  margin-right: 5px;
`;

const CardTitle = styled.div`
    color: #1A2D06;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ButtonNumbers = styled.div`
    display: flex;
    gap: 10px;
    align-items:center;
`;

const CardSubtitle = styled.div`
    color: #1A2D06;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Row = styled.div`
display: flex;
gap: 7px;
justify-content: start;
align-items: flex-start;
`;

const DetailSection = styled.div`
display: flex;
width: 100%;
align-items: start;
justify-content: space-between;
align-self: stretch;
`;

const TypeWrapper = styled.div`
// min-width: 50px;
// width: 150px;
// max-width: 200px;
`;