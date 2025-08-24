import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox'
import MenuGroup from '../../layout/MenuGroup'
import { fetchProposal, editProposalStatus } from '../../services/apis/proposalAPI'
import { getOwnerProfile } from '../../services/apis/ownerAPI'

const GroupReceiveSuggest = () => {
  const navigate = useNavigate();
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null); // 선택된 상태 필터
  const [summaryStats, setSummaryStats] = useState({
    read: 0,
    unread: 0,
    partnership: 0,
    rejected: 0
  });
  const [ownerProfiles, setOwnerProfiles] = useState({});

  // 받은 제안서 목록 가져오기
  useEffect(() => {
    const fetchReceivedProposals = async () => {
      try {
        setLoading(true);
        const response = await fetchProposal({
          box: 'inbox',
          ordering: '-created_at'
        });
        
        console.log('API 응답 전체:', response);
        console.log('받은 제안서 목록:', response.results || response);
        
        setReceivedProposals(response.results || response || []);

        // 상태별 통계 계산
        const stats = {
          read: 0,
          unread: 0,
          partnership: 0,
          rejected: 0
        };
        
        (response.results || response || []).forEach(proposal => {
          console.log('받은 제안서 상태:', proposal.current_status, proposal); 
          switch(proposal.current_status) {
            case 'UNREAD':
              stats.unread++;
              break;
            case 'READ':
              stats.read++;
              break;
            case 'PARTNERSHIP':
              stats.partnership++;
              break;
            case 'REJECTED':
              stats.rejected++;
              break;
          }
        });
        
        console.log('계산된 통계:', stats);
        setSummaryStats(stats);
      } catch (error) {
        console.error('받은 제안서 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedProposals();
  }, []);

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchAllOwnerProfiles = async () => {
      if (receivedProposals.length === 0) return;

      const profileIds = receivedProposals.map(proposal => proposal.author?.id);
      const uniqueIds = [...new Set(profileIds)].filter(id => id);
      
      console.log("고유한 아이디들:", uniqueIds);

      const profiles = {};
      
      for (const id of uniqueIds) {
        try {
          const profile = await getOwnerProfile(id);
          if (profile) {
            profiles[id] = profile;
            console.log(`아이디 ${id}의 전체 프로필 데이터:`, profile);
            console.log(`아이디 ${id}의 프로필:`, profile.profile_name, profile.comment);
          }
        } catch (error) {
          console.error(`아이디 ${id}의 프로필 가져오기 실패:`, error);
        }
      }
      
      setOwnerProfiles(profiles);
    };

    fetchAllOwnerProfiles();
  }, [receivedProposals]);

  // 날짜 파싱 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}. ${month}. ${day}`;
    } catch (error) {
      console.error('날짜 파싱 오류:', error);
      return dateString; // 파싱 실패 시 원본 문자열 반환
    }
  };

  // 제안서 데이터를 organization 형태로 변환
  const proposalOrganizations = receivedProposals.map(proposal => {
    const authorId = proposal.author?.id;
    const profile = ownerProfiles[authorId];
    
    return {
      id: proposal.id,
      name: proposal.author?.name || proposal.author,
      description: proposal.title,
      status: proposal.current_status,
      created_at: proposal.created_at,
      writtenDate: new Date(proposal.created_at).toLocaleDateString('ko-KR'),
      council_name: proposal.author?.council_name || proposal.author?.name,
      department: proposal.author?.department,
      photo: profile?.photo || null, // 프로필에서 photo 정보 추가
      ...proposal
    };
  });

  // 상태별 필터링된 제안서 목록
  const filteredProposalOrganizations = selectedStatus 
    ? proposalOrganizations.filter(proposal => proposal.status === selectedStatus)
    : proposalOrganizations;

  console.log("받은 제안서 데이터", proposalOrganizations);

  const STATUS_MAP = {
    UNREAD: "미열람",
    READ: "열람",
    PARTNERSHIP: "제휴체결",
    REJECTED: "거절"
  };

  const summaryItems = [
    { count: summaryStats.read, label: '열람', status: 'READ' },
    { count: summaryStats.unread, label: '미열람', status: 'UNREAD' },
    { count: summaryStats.partnership, label: '제휴 체결', status: 'PARTNERSHIP' },
    { count: summaryStats.rejected, label: '거절', status: 'REJECTED' }
  ];

  // 상태별 아이템 클릭 핸들러
  const handleStatusClick = (status) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  if (loading) {
    return (
      <PageContainer>
        <MenuGroup />
        <Loading>로딩 중...</Loading>
      </PageContainer>
    );
  }

  const handleProposalClick = async (proposal) => {
    console.log("클릭된 proposal:", proposal);
    
    try {
      // 제안서 상태를 READ로 변경
      if (proposal.status === 'UNREAD') {
        await editProposalStatus(proposal.id, { status: 'READ', comment: '' });
  
        // 로컬 상태도 업데이트
        setReceivedProposals(prevProposals => 
          prevProposals.map(p => 
            p.id === proposal.id 
              ? { ...p, current_status: 'READ' }
              : p
          )
        );
      }
    } catch (error) {
      console.error('제안서 상태 변경 실패:', error);
    }
    
    // 클릭 시 제안서 상세 페이지로 이동
    navigate(`/student-group/mypage/received-proposal/${proposal.id}`, { 
      state: { proposalId: proposal.id, proposal} 
    });
  }

  return (
    <PageContainer>
      <MenuGroup />
      <ContentContainer>
        <SuggestSummaryBox 
          items={summaryItems} 
          onItemClick={handleStatusClick}
          selectedStatus={selectedStatus}
        />
        
        {filteredProposalOrganizations.length > 0 ? (
          <CardListGrid>
            {filteredProposalOrganizations.map((proposal) => {
              const authorId = proposal.author?.id;
              const profile = ownerProfiles[authorId];
              
              return (
                <Cardwrapper 
                  key={proposal.id} 
                  onClick={() => handleProposalClick(proposal)} 
                  style={{ cursor: 'pointer' }}
                >
                  <ContentWrapper>
                    <TextWrapper>
                      <DateWrapper>
                        <SendText>수신일</SendText>
                        <DateText>{formatDate(proposal.created_at)}</DateText>
                      </DateWrapper>
                      <NameWrapper>
                        <NameText>
                          {profile?.profile_name || proposal.author?.name || '알 수 없음'}
                        </NameText>
           
                      </NameWrapper>
                      
                    </TextWrapper>
                    <ButtonWrapper>
                      {STATUS_MAP[proposal.status] || proposal.status}
                    </ButtonWrapper>
                  </ContentWrapper>
                </Cardwrapper>
              );
            })}
          </CardListGrid>
        ) : (
          <EmptyMessage>
            {selectedStatus 
              ? `${STATUS_MAP[selectedStatus]} 상태의 제안서가 없습니다.` 
              : '받은 제안서가 없습니다.'
            }
          </EmptyMessage>
        )}
      </ContentContainer>
    </PageContainer>
  )
}

export default GroupReceiveSuggest

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin: 0 auto;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  flex-grow: 1; /* 남은 공간을 모두 차지하도록 설정 */
  box-sizing: border-box; 
  align-items: center; 
  justify-content: start;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px 40px;
`;

// 그리드 가로 3, 세로 자동
const CardListGrid = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: start;
  align-content: start;
  column-gap: 20px;
  row-gap: 20px;
  text-align: left;
  font-size: 18px;
  color: #1A2D06;
  font-family: Pretendard;
`;

// const PageContainer = styled.div`
// display: flex;
// flex-direction: column;
// align-items: flex-start;
// width: 100%;
// position: relative;
// justify-content: flex-start; 
// min-height: 100vh;
// `;

const EmptyMessage = styled.div`
width: 100%;
text-align: center;
color: #C9C9C9;
font-size: 16px;
font-weight: 600;
justify-content: center;
align-content: center;
margin-top: 30px;
`;

const Loading = styled.div`
width: 100%;
text-align: center;
color: #70AF19;
font-weight: 600;
font-size: 16px;
justify-content: center;
align-content: center;
padding : 100px;
`;

const Cardwrapper = styled.div`
display: flex;
width: 400px;
height: 173px;
padding: 25px 18px 25px 30px;
flex-direction: column;
justify-content: center;
align-items: flex-start;
gap: 10px;
flex-shrink: 0;
border-radius: 5px;
border: 1px solid #E7E7E7;
box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const ContentWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 30px;
`;

const TextWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 10px;
align-self: stretch;
`;

const DateWrapper = styled.div`
display: flex;
width: 198.903px;
align-items: center;
gap: 30px;
color: #1A2D06;
`;

const NameWrapper = styled.div`
align-self: stretch;
`;

const NameText = styled.div`
color: var(--main-main950, #1A2D06);
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 600;
line-height: normal;
`;

const SendText = styled.div`
color: var(--main-main950, #1A2D06);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: normal;
`;

const DateText = styled.div`
color: var(--main-main950, #1A2D06);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

const ButtonWrapper = styled.div`
display: flex;
padding: 10px;
justify-content: flex-end;
align-items: center;
gap: 10px;
border-radius: 500px;
border: 1px solid var(--main-main600, #70AF19);
color: var(--main-main600, #70AF19);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;
