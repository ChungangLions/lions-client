import React from 'react'
import Menu from '../../../components/common/layout/Menu'
import styled from 'styled-components'
import ProposalDetail from './ProposalDetail'

const OwnerReceivedProposal = () => {
  return (
    <PageContainer>
        <Menu />
        <ProposalDetail />
    </PageContainer>
  )
}

export default OwnerReceivedProposal

const PageContainer = styled.div``;