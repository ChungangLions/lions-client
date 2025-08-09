import React from 'react'
import styled from 'styled-components'
import ButtonGroup from './ButtonGroup'
import UserInfo from './UserInfo'
import DetailInfo from './DetailInfo'

const CardSection = ({cardId, onClick}) => {
  return (
      <CardWrapper onClick = {onClick}>
        <CardGroup>
          <CardContent>
            <UserInfo cardId={cardId} />
            <DetailInfo cardId={cardId} />
            <ButtonGroup cardId={cardId} />
          </CardContent>
          </CardGroup>
      </CardWrapper>
  )
}

export default CardSection


const CardGroup = styled.div`
margin: 0 !important;
position: absolute;
top: 19.5px;
left: 48px;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
gap: 34px;
z-index: 0;
`

const CardWrapper = styled.div`
  top: 0px;
  left: 0px;
  background-color: #c6c6c6;
  width: 447px;
  height: 241px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CardContent = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
`;