// 제안서 상태 변경: "REJECTED"
import React from 'react'
import styled from 'styled-components';
import { editProposalStatus } from '../../../../services/apis/proposalAPI';


const RejectBtn = ({ proposalId, onReject }) => {
     const handleReject = async () => {
         try {
             await editProposalStatus(proposalId, { status: 'REJECTED', comment: '' });
             if (onReject) {
                 onReject();
             }
         } catch (error) {
             console.error('제안서 거절 실패:', error);
         }
     }
     
  return (
    <ButtonWrapper onClick={handleReject}>거절</ButtonWrapper>
  )
}

export default RejectBtn


const ButtonWrapper = styled.div`
width: 100%;
position: relative;
border-radius: 5px;
border: 1px solid #898989;
box-sizing: border-box;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 13px 81px;
text-align: left;
font-size: 16px;
color: #898989;
font-family: Pretendard;
cursor: pointer;
`;