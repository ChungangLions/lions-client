import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from './Modal';
import { IoIosClose } from "react-icons/io";
import { getAIDraftProposal } from '../../../services/apis/proposalAPI';
import useUserStore from '../../../stores/userStore';
import { getOwnerProfile } from '../../../services/apis/ownerAPI';

const SuggestDealBtn = ({organization}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {ownerId} = useUserStore();

    const goToAIProposalPage = async () => {
    setIsModalOpen(false);

    try {
        const ownerProfile = await getOwnerProfile(ownerId);

        const recipient = ownerProfile.user; // userId 가져오기
        const contactInfo = ownerProfile.contact; 
        
        const responseData = await getAIDraftProposal(recipient, contactInfo);
        
        console.log("AI 제안서 데이터:", responseData);
        
        // AI 제안서 데이터를 갖고 다음 페이지로 이동하기 
        navigate('/owner/ai-proposal', { state: { proposalData: responseData, state: { organization } } });
        
    } catch (error) {
        console.error("제안서를 가져오는 데 실패했습니다:", error);
    }
  };

  const goToProposalPage = async() => {
    setIsModalOpen(false);
    navigate('/owner/proposal', { state: { organization } });
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
              <p>우리 가게에 딱 맞는 제휴 조건, AI가 분석 완료!</p>
              <p>AI가 작성한 맞춤형 제안서를 확인하러 가 볼까요?</p>
            </ModalTitle>
            <ButtonGroup>
              <OptionButton onClick={goToProposalPage}>
                <p>아니오</p>
                <p>(직접 작성하기)</p>
              </OptionButton>
              <OptionButton primary onClick={goToAIProposalPage}>
                예
              </OptionButton>
            </ButtonGroup>
          </TextWrapper>
          <CloseIcon color = "#1A2D06" alt="닫기" onClick={() => setIsModalOpen(false)} />
        </ModalContentWrapper>
      </Modal>
    </>
  );
};

export default SuggestDealBtn;

const SuggestButton = styled.button`
  width: 100%;
  position: relative;
  border-radius: 5px;
  background-color: #64a10f;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-sizing: border-box;
  text-align: left;
  font-size: 16px;
  color: #e9f4d0;
  font-family: Pretendard;
  border: none;
  font-weight: 600;

  &: hover {
    background-color: #4c7b10;
  }

  &: active {
    background-color: #3f6113;
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