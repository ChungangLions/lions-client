// 헤더 존재하는 페이지의 경우에 사용
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import styled from 'styled-components'

const MainLayout = ({hasMenu}) => {
  console.log ("hasMenu: ", hasMenu);
  return (
    <PageContainer>
      <Header hasMenu={hasMenu}/>
      <ContentWrapper hasMenu={hasMenu}>
        <Outlet />
      </ContentWrapper>
    </PageContainer>
  )
}

export default MainLayout

const PageContainer = styled.div`
  box-sizing: border-box; 
  display: flex;
  flex-direction : column;
  width: 100%;
  align-items: center;
  height: 100vh;
  overflow-x: hidden;
  padding: 15px 29px;
  color: #1a2d06;

`;

const ContentWrapper = styled.div`
  flex-grow: 1; /* 남은 공간을 모두 차지하도록 설정 */
  box-sizing: border-box; 
  align-items: center; 
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  // padding-left: 30px;
  padding: ${({ hasMenu }) => (hasMenu ? '0px' : '0px 40px')};
  margin-top: ${({ hasMenu }) => (hasMenu ? '70px' : '85px')};
  // margin-top: 85px;
  color: #1a2d06;
`;