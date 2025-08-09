// 헤더 존재하는 페이지의 경우에 사용
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import styled from 'styled-components'

const MainLayout = () => {
  return (
    <PageContainer>
      <Header />
      <Outlet />
    </PageContainer>
  )
}

export default MainLayout

const PageContainer = styled.div`
`;