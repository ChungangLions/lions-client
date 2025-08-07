import React from 'react'
import styled from 'styled-components'
import ButtonGroup from './ButtonGroup'
import UserInfo from './UserInfo'

const CardSection = () => {
  return (
    <CardWrapper>
        
        <UserInfo></UserInfo>
        <ButtonGroup />
    </CardWrapper>
  )
}

export default CardSection

const CardWrapper = styled.div``;



