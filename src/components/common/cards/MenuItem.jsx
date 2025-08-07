import React from 'react';
import styled from 'styled-components';

function MenuItem({ image, name, price }) {
  return (
    <MenuContainer>
      <MenuImg src={image} alt={name} />
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
    width: 100px;
    height: 100px;
`;

const MenuImg = styled.img`
    
`;

const MenuName = styled.div``;

const MenuPrice = styled.div``;