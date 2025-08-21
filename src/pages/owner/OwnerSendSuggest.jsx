import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox'
import useStudentOrgStore from '../../stores/studentOrgStore'
import Menu from '../../layout/Menu'
import ViewBtn from '../../components/common/buttons/ViewBtn'
import { fetchProposal } from '../../services/apis/proposalAPI'

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
          console.log('제안서 상태:', proposal.status, proposal); // 디버깅용 로그
          switch(proposal.status) {
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
            default:
              // 알 수 없는 상태는 미열람으로 처리
              console.log('알 수 없는 상태:', proposal.status);
              stats.unread++;
          }
        });
        
        console.log('계산된 통계:', stats); // 디버깅용 로그
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
    name: proposal.recipient?.name || proposal.recipient || '알 수 없음',
    description: proposal.title || '제목 없음',
    status: proposal.status,
    created_at: proposal.created_at,
    // OrgCardSection에서 사용하는 필드들 추가
    writtenDate: proposal.created_at ? new Date(proposal.created_at).toLocaleDateString('ko-KR') : '날짜 없음',
    // UserInfo 컴포넌트에서 사용하는 필드들 추가
    council_name: proposal.recipient?.council_name || proposal.recipient?.name || '조직명 없음',
    department: proposal.recipient?.department || '부서명 없음',
    // 기타 필요한 필드들 추가
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
        <div>로딩 중...</div>
      </ScrollSection>
    );
  }

  return (
    <ScrollSection>
      <Menu />
      <SuggestSummaryBox items={summaryItems} />
      <CardListGrid> 
        {proposalOrganizations.length > 0 ? (
          proposalOrganizations.map((organization) => (
            <OrgCardSection 
              key={organization.id} 
              onClick={() => handleCardClick(organization)} 
              cardType={'suggest-sent'} 
              ButtonComponent={ViewBtn} 
              organization={organization} 
            />
          ))
        ) : (
          <EmptyMessage>보낸 제안서가 없습니다.</EmptyMessage>
        )}
      </CardListGrid>
    </ScrollSection>
  )
}

export default OwnerSendSuggest

// 그리드 가로 3, 세로 자동
const CardListGrid = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-rows: ;
  grid-template-columns: repeat(3, 447px); 
  justify-content: start;
  align-content: start;
  column-gap: 20px;
  row-gap: 20px;
  text-align: left;
  font-size: 18px;
  color: #000;
  font-family: Pretendard;
`;

const ScrollSection = styled.div`
display: flex;
flex-direction: column;
gap: 15px;
align-items: flex-start;

position: sticky;
top: 0;
// height: 100vh; 
`;

const EmptyMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;
