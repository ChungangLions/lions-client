import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import useUserStore from '../stores/userStore'
import SearchBar from './SearchBar'

//import { ReactComponent as Logo } from '../assets/images/logo.svg';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userRole, isLoggedin, logout } = useUserStore();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
          <UserContainer>
            <NavItem onClick = {toggleDropdown}>
              {userRole || '사장님'}
              <DropdownArrow isOpen={isDropdownOpen}>▼</DropdownArrow>
            </NavItem>
            {isDropdownOpen && (
            <DropdownMenu>
                  <DropdownItem onClick={handleLogout}>
                    로그아웃
                  </DropdownItem>
              </DropdownMenu>
              )}
          </UserContainer>
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
position: relative;
display: flex;
flex-direction: column;
align-items: center;
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
padding: 15px 30px;
width: 100%;
`;

const LeftBox = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 20px;
text-align: right;
background-color: white;

`;

const RightBox = styled.nav`
position: relative;
display: flex;
flex-direction: row;
align-items: center;
background-color: white;
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

.vectorIcon {
  	width: 100%;
  	position: relative;
  	max-width: 100%;
  	overflow: hidden;
  	height: 6px;
  	flex-shrink: 0;
}


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

const UserContainer = styled.div`
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
width: 1380px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
gap: 525px;
text-align: left;
font-size: 16px;
color: #000;
font-family: Pretendard;
background-color: white;
`;

const DividerContainer = styled.div`
width: 1380px;
position: relative;
justify-content: center;
margin-bottom : 0px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 90px;
  top: 100%;
  z-index: 10;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 100px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-top: 5px;
`;

const DropdownItem = styled.div`
  padding: 10px 10px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DropdownArrow = styled.span`
  margin-left: 5px;

  cursor: pointer;
`;
