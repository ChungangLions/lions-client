// 제안서 상태 변경 : "DRAFT"
import React from 'react'
import styled from 'styled-components';
import { editProposalStatus } from '../../../../services/apis/proposalAPI';


const AcceptBtn = ({ proposalId, onAccept }) => {
     const handleAccept = async () => {
         try {
             await editProposalStatus(proposalId, { status: 'PARTNERSHIP', comment: '' });
             
             if (onAccept) {
                 onAccept();
             }
             
         } catch (error) {
             console.error('제휴 체결 실패:', error);
             alert('제휴체결실패');
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