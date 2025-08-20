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

  // 로그인 한 유저가 사장님이라면 정보 그냥 가져오면 됨 
  const {userId} = useUserStore();

  // 로그인한 유저가 학생 단체라면 . . . 가게 사장님 profile id를 가져와야됨 

  // '예'를 누르는 순간 ai 제안서 생성 
    const handleProposal = async () => {
    try {
      const ownerProfile = await getOwnerProfile(userId);
      console.log("사장님 정보 잘 불러와지낭 ~ " ,userId);
      console.log("사장님 정보 잘 불러와지낭 ~ " , ownerProfile);
      const recipient = userId;
      const contact_info = ownerProfile.contact;
      console.log("사장님 정보 잘 불러와지낭 ~ " ,contact_info);

      // AI 제안서 생성하기 
      const responseData = await getAIDraftProposal(recipient, contact_info);
      console.log("제안서 내용", responseData);

    } catch (error) {
      console.error("제안서를 생성하는데 실패했습니다.", error);
    }
    setIsModalOpen(false);
    //navigate('/owner/proposal', { state: { organization } });
  }
  
  
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
              <OptionButton primary onClick={handleProposal}>
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
  cursor: pointer;

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