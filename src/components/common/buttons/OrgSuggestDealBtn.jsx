import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from './Modal';
import { IoIosClose } from "react-icons/io";
import { getAIDraftProposal, getAutoAIDraftProposal } from '../../../services/apis/proposalAPI';
import useUserStore from '../../../stores/userStore';
import { getOwnerProfile } from '../../../services/apis/ownerAPI';
import Loading from '../../../layout/Loading';

// 여기서 profileData는 가게 프로필 데이터임 !! 
const OrgSuggestDealBtn = ({profileData}) => {
  console.log("넘어온 데이터",profileData);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const [isLoading, setIsLoading] = useState(false);
  const [loadingVariant, setLoadingVariant] = useState('form');
  

  // '예'를 누르면 바로 ai 제안서 생성  : 학생회 -> 사장
  const handleProposal = async () => {
    setLoadingVariant('ai');
    setIsLoading(true);
    try {
      
      const recipient = profileData.user; // 사장님 유저 아이디 .. 프로필 아이디면 -> profileData.id
      const contact_info = "";
      
      console.log({ recipient, contact_info });

      const proposalData = await getAutoAIDraftProposal(recipient, contact_info);
      console.log("제안서 내용", proposalData);

      // AI 제안서 페이지로 이동 

      navigate('/student-group/ai-proposal', { state: {profileData, isAI: true, proposalData } });
    } catch (error) {
      console.error("제안서를 생성하는데 실패했습니다.", error);
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  }
  
  
  const goToProposalPage = async() => {
    setLoadingVariant('form');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/student-group/proposal', { state: { profileData, isAI: false } });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  }


  return (
    <>
      <SuggestButton onClick={() => setIsModalOpen(true)}>
        제휴 제안하기
      </SuggestButton>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContentWrapper>
          <TextWrapper>
            <ModalTitle>
              <p>이 가게에 딱 맞는 제휴 조건, AI가 분석 완료!</p>
              <p>AI가 작성한 맞춤형 제안서를 확인하러 가 볼까요?</p>
            </ModalTitle>
            <ButtonGroup>
              <OptionButton onClick={goToProposalPage}>
                <p>아니오</p>
                <p>(직접 작성하기)</p>
              </OptionButton>
              <OptionButton primary onClick={handleProposal}>
                예
              </OptionButton>
            </ButtonGroup>
          </TextWrapper>
          <CloseIcon color = "#1A2D06" alt="닫기" onClick={() => setIsModalOpen(false)} />
        </ModalContentWrapper>
      </Modal>

      {isLoading && (
        <Loading
          situation={loadingVariant === 'ai' ? 'ai' : 'form'}
          fullscreen
        />
      )}
    </>
  );
};

export default OrgSuggestDealBtn;

const SuggestButton = styled.button`
  width: 100%;
  position: relative;
  border-radius: 5px;
  background-color:  #e9f4d;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-sizing: border-box;
  text-align: left;
  font-size: 16px;
  border: 1px solid #70af19;
  background-color: white;
  color: #64a10f;
  font-family: Pretendard;
  cursor: pointer;

  &: hover {
    background-color: #e9f4d0;
  }

  &: active {
    background-color: #64a10f;
    color:#e9f4d0
  }
`;

const ModalContentWrapper = styled.div`
  width: 546px;
  height: 280px;
  border-radius: 5px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 81px 79px 61px;
  box-sizing: border-box;
  position: relative; 
`;

const CloseIcon = styled(IoIosClose)`
  width: 24px;
  height: 24px;
  position: absolute;
  top: 17px;
  left: 505px;
  cursor: pointer;
  z-index: 1;
`;

const TextWrapper = styled.div`
  width: 387px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 40px;
  text-align: center;
`;

const ModalTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  p {
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  color: #898989;
`;

const OptionButton = styled.button`
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #898989;
  background-color: transparent;
  width: 134px;

  ${props =>
    props.primary &&
    `
    width: 237px;
    background-color: #64a10f;
    color: #e9f4d0;
    font-weight: 600;
    border: none;
  `}

  p {
    margin: 0;
    font-size: 14px;
  }
`;