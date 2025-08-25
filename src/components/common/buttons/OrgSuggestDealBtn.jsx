// 학생단체 로그인, 제안하기 to 사장님의 경우 사용하는 Btn
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from './Modal';
import { IoIosClose } from "react-icons/io";
import { fetchProposal, getAIDraftProposal, getAutoAIDraftProposal } from '../../../services/apis/proposalAPI';
import useUserStore from '../../../stores/userStore';
import { getOwnerProfile } from '../../../services/apis/ownerAPI';
import Loading from '../../../layout/Loading';

// 여기서 profileData는 가게 프로필 데이터임 !! 
const OrgSuggestDealBtn = ({profileData}) => {
  console.log("넘어온 데이터",profileData);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasExistingProposal, setHasExistingProposal] = useState(false);
  const [proposalStatus, setProposalStatus] = useState(null); 
  const [isCheckingProposal, setIsCheckingProposal] = useState(false);
  const [profileUpdatedAfterProposal, setProfileUpdatedAfterProposal] = useState(false);
 
  const [isLoading, setIsLoading] = useState(false);
  const [loadingVariant, setLoadingVariant] = useState('form');

  // 모달 열 때 기존 제안서 확인
  const handleModalOpen = async () => {
    setIsCheckingProposal(true);
    
    try {
      const recipient = profileData.user;
      const list = await fetchProposal({ box: 'sent', ordering: '-modified_at' });
      const proposals = list.results || list || [];
      const existingDraft = proposals.find(p => {
        const r = p.recipient || {};
        return (r.id != null ? r.id === recipient : r === recipient);
      }) || null;
      
      if (existingDraft) {
        setHasExistingProposal(true);
        // 제안서 상태 확인 (DRAFT = 작성중, SENT = 전송됨)
        setProposalStatus(existingDraft.current_status || 'DRAFT');
        
        // 전송된 제안서인 경우 프로필 수정 시간 확인
        if (existingDraft.current_status === 'UNREAD' || existingDraft.current_status === 'READ' || existingDraft.current_status === 'PARTNERSHIP') {
          try {
            const ownerProfile = await getOwnerProfile(recipient);
            if (ownerProfile) {
              const proposalCreatedAt = new Date(existingDraft.created_at);
              const profileUpdatedAt = new Date(ownerProfile.updated_at);
              setProfileUpdatedAfterProposal(profileUpdatedAt > proposalCreatedAt);
            }
          } catch (e) {
            console.warn('프로필 조회 실패:', e);
            setProfileUpdatedAfterProposal(false);
          }
        }
      } else {
        setHasExistingProposal(false);
        setProposalStatus(null);
        setProfileUpdatedAfterProposal(false);
      }
    } catch (e) {
      console.warn('기존 제안서 조회 실패:', e);
      setHasExistingProposal(false);
      setProposalStatus(null);
      setProfileUpdatedAfterProposal(false);
    } finally {
      setIsCheckingProposal(false);
      setIsModalOpen(true);
    }
  };

  // 제안서 상태에 따른 모달 메시지 반환
  const getModalMessage = () => {
    if (!hasExistingProposal) {
      return {
        title: "이 가게에 딱 맞는 제휴 조건, AI가 분석 완료!",
        subtitle: "AI가 작성한 맞춤형 제안서를 확인하러 가 볼까요?"
      };
    }

    // 전송된 제안서인 경우
    if (proposalStatus === 'UNREAD' || proposalStatus === 'READ' || proposalStatus === 'PARTNERSHIP') {
      if (profileUpdatedAfterProposal) {
        return {
          title: "이 가게에 딱 맞는 제휴 조건, AI가 분석 완료!",
          subtitle: "AI가 작성한 맞춤형 제안서를 확인하러 가 볼까요?"
        };
      } else {
        return {
          title: "이미 제안서를 전송했던 적이 있어요.",
          subtitle: "보낸 제안 목록으로 넘어갈까요?"
        };
      }
    }

    if (proposalStatus === 'DRAFT') {
      return {
        title: "이전에 작성 중이던 제안서가 있어요.",
        subtitle: "이어서 작성하러 갈까요?"
      };
    }

    return {
      title: "기존에 작성했던 제안서가 있어요",
      subtitle: "기존에 작성했던 제안서를 불러올게요."
    };
  };

  // 제안서 상태에 따른 버튼 동작
  const handleProposalAction = async () => {
    // 전송된 제안서인 경우
    if (proposalStatus === 'UNREAD' || proposalStatus === 'READ' || proposalStatus === 'PARTNERSHIP') {
      if (profileUpdatedAfterProposal) {
        // 프로필이 최근에 수정된 경우 새로 생성
        await handleProposal();
        return;
      } else {
        // 프로필 변화가 없는 경우 보낸 제안 목록으로 이동
        navigate('/student-group/mypage/sent-suggest');
        return;
      }
    }

    // 기존 handleProposal 로직 실행
    await handleProposal();
  };
  
  // '예'를 누르면 바로 ai 제안서 생성  : 학생회 -> 사장
  
  const handleProposal = async () => {
    try {
      const recipient = profileData.user;
      const contact_info = profileData.contact;

      let existingDraft = null;
      try {
        const list = await fetchProposal({ box: 'sent', ordering: '-modified_at' });
        const proposals = list.results || list || [];
        existingDraft = proposals.find(p => {
          const r = p.recipient || {};
          // recipient가 객체일 때 id로 매칭, 아니면 값 자체 비교
          return (r.id != null ? r.id === recipient : r === recipient);
        }) || null;
      } catch (e) {
        console.warn('기존 제안서 조회 실패:', e);
      }

      // 기존 작성한 제안서가 있는 경우
      if (existingDraft) {
        console.log('기존 작성중 제안서 발견:', existingDraft);
        
        // 전송된 제안서인 경우 프로필 변화 여부 확인
        if (existingDraft.current_status === 'UNREAD' || existingDraft.current_status === 'READ' || existingDraft.current_status === 'PARTNERSHIP') {
          console.log('전송된 제안서 발견:', existingDraft);
          
          // 사장님 프로필 수정 시간과 제안서 생성 시간 비교
          try {
            const ownerProfile = await getOwnerProfile(recipient);
            if (ownerProfile) {
              const proposalCreatedAt = new Date(existingDraft.created_at);
              const profileUpdatedAt = new Date(ownerProfile.updated_at);
              
              // 프로필 수정 시간이 제안서 생성 시간보다 최근이면 새로 생성
              if (profileUpdatedAt > proposalCreatedAt) {
                console.log('전송된 제안서가 있지만 프로필이 최근에 수정되어 새로 생성합니다.');
                setLoadingVariant('ai');
                setIsLoading(true);
                
                const proposalData = await getAutoAIDraftProposal(recipient, contact_info);
                console.log("새로 생성된 제안서 내용", proposalData);
                
                navigate('/student-group/ai-proposal', { state: {profileData, isAI: true, proposalData } });
                return;
              }
            }
          } catch (profileError) {
            console.warn('사장님 프로필 조회 실패:', profileError);
            // 프로필 조회 실패 시 보낸 제안 목록으로 이동
          }
          
          // 프로필 변화가 없거나 프로필 조회 실패 시 보낸 제안 목록으로 이동
          navigate('/student-group/mypage/sent-suggest');
          return;
        }
        
        // 작성중인 제안서인 경우 프로필 수정 시간과 비교
        try {
          const ownerProfile = await getOwnerProfile(recipient);
          if (ownerProfile) {
            const proposalCreatedAt = new Date(existingDraft.created_at); // 제안서 생성한 시간
            const profileUpdatedAt = new Date(ownerProfile.modified_at); // 프로필 수정한 시간
            
                
            console.log('=== 시간 비교 정보 ===');
            console.log('제안서 생성 시간 (created_at):', existingDraft.created_at);
            console.log('제안서 생성 시간 (Date 객체):', proposalCreatedAt);
            console.log('프로필 수정 시간 (modified_at):', ownerProfile.modified_at);
            console.log('프로필 수정 시간 (Date 객체):', profileUpdatedAt);
            console.log('프로필이 더 최근인가?:', profileUpdatedAt > proposalCreatedAt);
            console.log('========================');

            // 프로필 수정 시간이 제안서 생성 시간보다 최근이면 새로 생성
            if (profileUpdatedAt > proposalCreatedAt) {
              console.log('최근에 프로필을 수정하셨네요!');
              setLoadingVariant('ai');
              setIsLoading(true);
              
              const proposalData = await getAutoAIDraftProposal(recipient, contact_info);
              console.log("새로 생성된 제안서 내용", proposalData);
              
              navigate('/student-group/ai-proposal', { state: {profileData, isAI: true, proposalData } });
              return;
            }
          }
        } catch (profileError) {
          console.warn('사장님 프로필 조회 실패:', profileError);
          // 프로필 조회 실패 시 기존 제안서 사용
        }
        
        // 제안서 생성이 더 최근이거나 프로필 조회 실패 시 기존 제안서 사용
        navigate('/student-group/ai-proposal', { state: {profileData, isAI: true, proposalData: existingDraft } });
        return;
      }
      
      // 2) 없으면 AI로 생성 후 이동
      // 로딩이 기존 제안서 있을 땐 X, 없을 때 로딩화면 뜸 

    setLoadingVariant('ai');
    setIsLoading(true);
  
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
      <SuggestButton onClick={handleModalOpen} disabled={isCheckingProposal}>
        {isCheckingProposal ? '확인 중...' : '제휴 제안하기'}
      </SuggestButton>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContentWrapper>
          <TextWrapper>
            <ModalTitle>
              <p>{getModalMessage().title}</p>
              <p>{getModalMessage().subtitle}</p>
            </ModalTitle>
            <ButtonGroup>
              <OptionButton onClick={goToProposalPage}>
                <p>아니오</p>
                <p>(직접 작성하기)</p>
              </OptionButton>
              <OptionButton primary onClick={handleProposalAction}>
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