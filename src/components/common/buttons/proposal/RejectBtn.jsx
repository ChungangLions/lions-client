// 제안서 상태 변경: "REJECTED"
import React from 'react'
import styled from 'styled-components';
import { editProposalStatus, getProposal } from '../../../../services/apis/proposalAPI';


const RejectBtn = ({ proposalId, onReject, onShowModal }) => {
     const handleReject = async () => {
         try {
             // 현재 제안서 상태 확인
             const proposal = await getProposal(proposalId);
             
             // 이미 제휴가 체결된 상태라면 모달 표시
             if (proposal.current_status === 'PARTNERSHIP') {
                 if (onShowModal) {
                     onShowModal('이미 제휴 체결된 제안서입니다.');
                 } else {
                     alert('이미 제휴 체결된 제안서입니다.');
                 }
                 return;
             }
             
             await editProposalStatus(proposalId, { status: 'REJECTED', comment: '' });
             if (onReject) {
                 onReject();
             }
         } catch (error) {
             console.error('제안서 거절 실패:', error);
             if (onShowModal) {
                 onShowModal('제안서 거절에 실패했습니다.');
             } else {
                 alert('제안서 거절 실패');
             }
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