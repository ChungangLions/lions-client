import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
//import { ReactComponent as Logo } from '../assets/images/logo.svg';
import SearchBar from '../filters/SearchBar'

const Header = () => {
  return (
    <HeaderContainer>
      {/* 
      <Logo className='logo-image' /> 
      <div>로고</div>
      <div>홈</div>
      */}
      <SearchBar/>
      <Link to="/owner/mypage">마이페이지</Link>
    </HeaderContainer>
  )
}

export default Header

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
