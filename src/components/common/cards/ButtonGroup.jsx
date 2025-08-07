import React from 'react'
import FavoriteBtn from '../../common/buttons/FavoriteBtn';
import SuggestDealBtn from '../../common/buttons/SuggestDealBtn';
import styled from 'styled-components';

const ButtonGroup = () => {
  return (
    <ButtonWrapper>
        <FavoriteBtn />
        <SuggestDealBtn />
    </ButtonWrapper>
  )
}

export default ButtonGroup

const ButtonWrapper = styled.div`
`;