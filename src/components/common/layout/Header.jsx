import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import SearchBar from '../filters/SearchBar'
//import { ReactComponent as Logo } from '../assets/images/logo.svg';

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderGroup>
        <LeftBox>
          <Logo>
            로고
          </Logo>
        </LeftBox>
        <SearchBar />
        <RightBox>
          <LogoutContainer>
          <NavItem>사장님</NavItem>
          </LogoutContainer>
          <StyledLink to="mypage">
          <NavItem>마이페이지</NavItem>
          </StyledLink>
        </RightBox>
      </HeaderGroup>
      <DividerContainer>
        <Divider />
      </DividerContainer>
    </HeaderContainer>
  )
}

export default Header

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const HeaderContainer = styled.div`
width: 100%;
position: relative;
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-between;
gap: 0px;
text-align: left;
font-size: 16px;
color: #000;
font-family: Pretendard;
`;

const LeftBox = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 20px;
`;

const RightBox = styled.nav`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 2px;
`;

const NavItem = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
`;

const Logo = styled.div`
width: 97px;
background-color: #d9d9d9;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 13px 0px;
box-sizing: border-box;
`;

const LogoutContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
gap: 5px;
`;

const Divider = styled.div`
width: 100%;
position: relative;
border-top: 1px solid #000;
box-sizing: border-box;
height: 1px;
padding: 15px;
`;

const HeaderGroup = styled.div`
width: 100%;
position: relative;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
gap: 0px;
text-align: left;
font-size: 16px;
color: #000;
font-family: Pretendard;
`;

const DividerContainer = styled.div`
width: 1380px;
position: relative;
justify-content: center;
`;
