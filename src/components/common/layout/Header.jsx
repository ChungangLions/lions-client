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
        <SearchBar />
        </LeftBox>
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
width: 1380px;
position: relative;
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-between;
gap: 15px;
text-align: left;
font-size: 16px;
color: #000;
font-family: Pretendard;
/*스크롤 관련*/
position: sticky;
top:0;
background-color: white;
z-index: 1000;
margin: 15px 30px;
`;

const LeftBox = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 20px;
text-align: right;
`;

const RightBox = styled.nav`
position: relative;
display: flex;
flex-direction: row;
align-items: center;

gap: 2px;
font-size: 16px;
color: #000;
font-family: Pretendard;
`;

const NavItem = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
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
position: relative;
border-top: 1px solid #000;
box-sizing: border-box;
height: 1px;
`;

const HeaderGroup = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
gap: 525px;
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
