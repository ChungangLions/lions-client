import React from 'react';
import styled from 'styled-components';

function MenuItem({ image, name, price }) {
  return (
    <MenuContainer>
      <FakeMenuImage/>
      {/* <MenuImg src={image} alt={name} /> */}
      <MenuName>{name}</MenuName>
      <MenuPrice>{price}원</MenuPrice>
    </MenuContainer>
  );
}

export default MenuItem;

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    // width: 120px;
    // height: 162px;
`;

const MenuImg = styled.img`
    
`;

const FakeMenuImage = styled.div`
  width: 145px; // 원래 120px이 맞음
  height: 145px; // 원래 120px이 맞음
  background: #D9D9D9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 9px;
`;

const MenuName = styled.div`
  font-weight: 400;
  font-size: 16px;
`;

const MenuPrice = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: #8D8D8D8D
`;