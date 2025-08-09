import React from 'react'
import FavoriteBtn from '../../common/buttons/FavoriteBtn';
import SuggestDealBtn from '../../common/buttons/SuggestDealBtn';
import styled from 'styled-components';

const ButtonGroup = () => {
  return (
    <ButtonWrapper>
        <FavoriteBtn />
    </ButtonWrapper>
  )
}

export default ButtonGroup

const ButtonWrapper = styled.div`
width: 100%;
position: absolute;
margin: 0 !important;
top: 0px;
left: 333px;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
padding: 10px;
box-sizing: border-box;
`;