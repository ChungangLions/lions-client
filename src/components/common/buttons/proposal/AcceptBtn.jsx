// 제안서 상태 변경 : "DRAFT"
import React from 'react'
import styled from 'styled-components';
import { editProposalStatus, getProposal } from '../../../../services/apis/proposalAPI';


const AcceptBtn = ({ proposalId, onAccept, currentStatus, onShowModal }) => {
     const handleAccept = async () => {
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
             
             await editProposalStatus(proposalId, { status: 'PARTNERSHIP', comment: '' });
             
             if (onAccept) {
                 onAccept();
             }
             
         } catch (error) {
             console.error('제휴 체결 실패:', error);
             if (onShowModal) {
                 onShowModal('제휴 체결에 실패했습니다.');
             } else {
                 alert('제휴체결실패');
             }
         }
     }
     
  return (
    <ButtonWrapper onClick={handleAccept}>수락</ButtonWrapper>
  )
}

export default AcceptBtn


const ButtonWrapper = styled.div`
width: 100%;
position: relative;
border-radius: 5px;
border: 1px solid none;
box-sizing: border-box;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 13px 81px;
text-align: left;
font-size: 16px;
color: #e9f4d0;
font-family: Pretendard;
cursor: pointer;
background-color: #70af19;
`;