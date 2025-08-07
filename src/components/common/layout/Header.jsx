import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
//import { ReactComponent as Logo } from '../assets/images/logo.svg';

const Header = () => {
  return (
    <HeaderContainer>
      {/* 
      <Logo className='logo-image' /> 
      <div>로고</div>
      <div>홈</div>
      */}
      <Link to="mypage">마이페이지</Link>
    </HeaderContainer>
  )
}

export default Header

const HeaderContainer = styled.div`
`;
