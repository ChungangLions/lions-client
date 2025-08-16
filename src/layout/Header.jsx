import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import useUserStore from '../stores/userStore'
import SearchBar from './SearchBar'
import { IoIosArrowDown } from "react-icons/io";
import { ReactComponent as ProfileIcon } from '../assets/images/icons/Profile.svg'

//import { ReactComponent as Logo } from '../assets/images/logo.svg';

const Header = ({hasMenu}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userRole, isLoggedin, setLogoutStatus } = useUserStore(); // 로그인 정보 불러오기
  const navigate = useNavigate();

  //console.log("현재 userRole:", userRole); 

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setLogoutStatus();
    setTimeout(() => { // 타임아웃 없으면 렌더링 충돌
    navigate("/");
  }, 0);
};

  const navigateToMyPage = userRole ? `/${userRole.toLowerCase()}/mypage`: '/';

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
              {userRole === 'OWNER' 
                ? '사장님' 
                : userRole === 'student_group' 
                  ? '학생 단체' 
                  : '학생'}
              <DropdownArrow />
            </NavItem>
            {isDropdownOpen && (
            <DropdownMenu>
                  <DropdownItem onClick={handleLogout}>
                    로그아웃
                  </DropdownItem>
              </DropdownMenu>
              )}
          </UserContainer>
          <StyledLink to={navigateToMyPage}>
          <ProfileIcon />
          </StyledLink>
        </RightBox>
      </HeaderGroup>
      { !hasMenu && <Divider /> }
    </HeaderContainer>
  )
}

export default Header

const StyledLink = styled(Link)`
width: 28px;
position: relative;
height: 28px;
`;

const HeaderContainer = styled.div`
box-sizing: border-box; 
width: 100%;
position: relative;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
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
`;

const LeftBox = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 20px;
background-color: white;
`;

const RightBox = styled.nav`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 15px;
color: #1a2d06;
`;

const NavItem = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
gap: 5px;
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
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
box-sizing: border-box;
gap: 5px;
text-align: left;
font-size: 16px;
color: #1a2d06;
font-family: Pretendard;
`;

const Divider = styled.div`
align-self: stretch;
position: relative;
max-width: 100%;
overflow: hidden;
max-height: 100%;
width: 100%;
position: relative;
border-top: 1px solid #e7e7e7;
box-sizing: border-box;
height: 1px;
`;

const HeaderGroup = styled.div`
align-self: stretch;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
gap: 0px;
background-color: white;
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

const DropdownArrow = styled(IoIosArrowDown)`
  margin-left: 5px;

  cursor: pointer;
`;
