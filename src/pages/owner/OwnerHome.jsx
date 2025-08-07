import React from 'react'
import Header from '../../components/common/layout/Header'
import SearchBar from '../../components/common/filters/SearchBar'
import styled from 'styled-components'
import CardSection from '../../components/common/cards/CardSection'

const OwnerHome = () => {
  return (
    <PageContainer>
      <Header />
      <ContentWrapper>
        <SearchBar />
        <CardSection>
        </CardSection>
      </ContentWrapper>
    </PageContainer>
  )
}

export default OwnerHome

const PageContainer = styled.div`

`;

const ContentWrapper = styled.div`

`;