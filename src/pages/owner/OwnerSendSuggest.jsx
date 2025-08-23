import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox'
import useStudentOrgStore from '../../stores/studentOrgStore'
import Menu from '../../layout/Menu'
import { fetchProposal } from '../../services/apis/proposalAPI'
import StatusBtn from '../../components/common/buttons/StatusBtn'

const OwnerSendSuggest = () => {
  const navigate = useNavigate();
  const [sentProposals, setSentProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    writing: 0,
    read: 0,
    unread: 0,
    partnership: 0,
    rejected: 0
  });

  // 보낸 제안서 목록 가져오기
  useEffect(() => {
    const fetchSentProposals = async () => {
      try {
        setLoading(true);
        // box=sent로 설정하여 보낸 제안서만 가져오기
        const response = await fetchProposal({
          box: 'sent',
          ordering: '-created_at'
        });
        
        setSentProposals(response.results || response || []);
        
        // 상태별 통계 계산
        const stats = {
          writing: 0,
          read: 0,
          unread: 0,
          partnership: 0,
          rejected: 0
        };
        
        (response.results || response || []).forEach(proposal => {
          console.log('제안서 상태:', proposal.current_status, proposal); 
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
            case 'DRAFT':
              stats.writing++;
              break;
          }
        });
        
        console.log('계산된 통계:', stats); // 총 개수 계산
        setSummaryStats(stats);
      } catch (error) {
        console.error('보낸 제안서 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentProposals();
  }, []);

  const handleCardClick = (proposal) => {
    navigate(`/owner/proposal`, { state: { proposal } });
  };

  // zustand store에서 사용할 것들 가져오기 
  const {
    organizations,
  } = useStudentOrgStore();

  // 제안서 데이터를 organization 형태로 변환
  const proposalOrganizations = sentProposals.map(proposal => ({
    id: proposal.id,
    name: proposal.recipient?.name || proposal.recipient ,
    description: proposal.title ,
    status: proposal.current_status,
    created_at: proposal.created_at,
    writtenDate: new Date(proposal.created_at).toLocaleDateString('ko-KR'),
    council_name: proposal.recipient?.council_name || proposal.recipient?.name ,
    department: proposal.recipient?.department,
    ...proposal
  }));

  const summaryItems = [
    { count: summaryStats.writing, label: '작성 중'},
    { count: summaryStats.read, label: '열람' },
    { count: summaryStats.unread, label: '미열람' },
    { count: summaryStats.partnership, label: '제휴 체결' },
    { count: summaryStats.rejected, label: '거절' }
  ];

  if (loading) {
    return (
      <ScrollSection>
        <Menu />
        <Loading>로딩 중...</Loading>
      </ScrollSection>
    );
  }

    const STATUS_MAP = {
    UNREAD: "미열람",
    READ: "열람",
    PARTNERSHIP: "제휴체결",
    REJECTED: "거절"
  };
  
  const handleProposalClick = (proposal) => {
    // 클릭 시 제안서 상세 페이지로 이동
    navigate(`/owner/mypage/sent-proposal/${proposal.id}`, { 
      state: { proposal } 
    });
  }


  return (
    <ScrollSection>
      <Menu />     
      <ContentContainer>
        <SuggestSummaryBox items={summaryItems} />
      
        {proposalOrganizations.length > 0 ? (
          <CardListGrid> 
          {proposalOrganizations.map((organization) => (
            <OrgCardSection 
              key={organization.id} 
              onClick={() => handleProposalClick(organization)} 
              cardType={'suggest-sent'} 
              ButtonComponent= {() => <StatusBtn> {STATUS_MAP[organization.status]} </StatusBtn>} 
              organization={organization} 
            />
          ))}
          </CardListGrid>
        ) : (
          <EmptyMessage>보낸 제안서가 없습니다.</EmptyMessage>
        )}
      </ContentContainer>
    </ScrollSection>
  )
}

export default OwnerSendSuggest

// 그리드 가로 3, 세로 자동
const CardListGrid = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(447px, 1fr));
  justify-content: start;
  align-content: start;
  column-gap: 20px;
  row-gap: 20px;
  text-align: left;
  font-size: 18px;
  color: #1A2D06;
  font-family: Pretendard;
`;

const ScrollSection = styled.div`
display: flex;
flex-direction: column;
width: 100%;
position: relative;
justify-content: flex-start; 
min-height: 100vh; /* 화면 높이 채워야 위에서 시작할 수 있구나 .. ㅠ */
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

const EmptyMessage = styled.div`
width: 100%;
text-align: center;
  color: #C9C9C9;
    font-weight: 600;
  font-size: 16px;
    justify-content: center;
  align-content: center;
  margin-top: 30px;
`;

const ContentContainer = styled.div`
  flex-grow: 1; /* 남은 공간을 모두 차지하도록 설정 */
  box-sizing: border-box; 
  align-items: center; 
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px 40px;
`;