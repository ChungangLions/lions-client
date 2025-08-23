import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import GroupCard from '../../components/common/cards/GroupCard'
import { useNavigate } from 'react-router-dom'
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox'
import useStudentOrgStore from '../../stores/studentOrgStore'
import Menu from '../../layout/Menu'
import StatusBtn from '../../components/common/buttons/StatusBtn'
import { fetchProposal } from '../../services/apis/proposalAPI'
import { getOwnerProfile } from '../../services/apis/ownerAPI'
import ProposalCard from '../../layout/ProposalCard'

const OwnerReceiveSuggest = () => {
  const navigate = useNavigate();
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    read: 0,
    unread: 0,
    partnership: 0,
    rejected: 0
  });

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
        
        setReceivedProposals(response.results || response || []); // receivedProposals가 받은 제안서들
        
        // 상태별 통계 계산
        const stats = {
          read: 0,
          unread: 0,
          partnership: 0,
          rejected: 0
        };
        
        (response.results || response || []).forEach(proposal => {
          console.log('받은 제안서 상태:', proposal.current_status, proposal); 
          console.log('제안서 recipient 정보:', proposal.recipient);
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

  const [proposalStores, setProposalStores] = useState([]);

  // 제안서 데이터를 owner 형태로 변환 (비동기 처리)
  useEffect(() => {
    const fetchProposalStores = async () => {
      if (receivedProposals.length === 0) return;

      const storesWithProfiles = await Promise.all(
        receivedProposals.map(async (proposal) => {
          const ownerId = proposal.recipient.id;
          
          console.log('제안서 ID:', proposal.id, '사장님 정보:', ownerId);

          const ownerProfile = await getOwnerProfile(ownerId);

          console.log('가게 정보', ownerProfile);
          
          return {
            id: proposal.id,
            status: proposal.current_status,
            created_at: proposal.created_at,
            receivedDate: new Date(proposal.created_at).toLocaleDateString('ko-KR'),
            ...(ownerProfile || {}) // ownerProfile이 null인 경우 빈 객체로 처리
          };
        })
      );

      setProposalStores(storesWithProfiles);
    };

    fetchProposalStores();
  }, [receivedProposals]);

  console.log("받은 제안서 데이터", proposalStores); // proposalStores가 사장님 프로필 + 제안서 데이터 합친 배열

  const STATUS_MAP = {
    UNREAD: "미열람",
    READ: "열람",
    PARTNERSHIP: "제휴체결",
    REJECTED: "거절"
  };

  const summaryItems = [
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

  const handleProposalClick = (proposal) => {
    navigate(`/owner/mypage/received-proposal/${proposal.id}`, { 
      state: { proposal, proposalStores } 
    });
  }


  return (
    <ScrollSection>
      <ContentContainer>
      <Menu />
        <SuggestSummaryBox items={summaryItems} />
 
        {proposalStores.length > 0 ? (
          <CardListGrid> 
          {proposalStores.map((store) => (
            <ProposalCard
              key={store.id}
              imageUrl={store.photos[0].image}
              onClick={handleProposalClick}
    
              store={store}
     
            />
          ))
        }
         </CardListGrid>
         ) : (
          <EmptyMessage>받은 제안서가 없습니다.</EmptyMessage>
        )}
      </ContentContainer>
    </ScrollSection>
  )
}

export default OwnerReceiveSuggest

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
align-items: flex-start;
width: 100%;
position: relative;
justify-content: flex-start; 
min-height: 100vh; /* 화면 높이 채워야 위에서 시작할 수 있구나 .. ㅠ */
`;

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
