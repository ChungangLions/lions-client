import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import SearchBar from '../filters/SearchBar'
//import { ReactComponent as Logo } from '../assets/images/logo.svg';

const Header = () => {
  return (
    <>
    <HeaderContainer>
      <LeftBox>
        <Logo>
          로고
        </Logo>
      </LeftBox>
      <SearchBar />
      <RightBox>
        <Link to="/">
        <NavItem>홈</NavItem>
        </Link>
        <Link to="mypage">
        <NavItem>마이페이지</NavItem>
        </Link>
      </RightBox>
    </HeaderContainer>
    <div
       style={
        {width: '100%', 
        height: '100%', 
        outline: '1px black solid', 
        outlineOffset: '-0.50px'}
        }>
        </div>
      </>
  )
}

export default Header

const HeaderContainer = styled.div`
 width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;

const LeftBox = styled.div`
  display: flex;
  align-items: center;
`;

const RightBox = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavItem = styled.div`
  width: 70px;
  position: relative;
  font-size: 16px;
  font-family: Pretendard;
  color: #000;
  text-align: left;
  display: inline-block;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
