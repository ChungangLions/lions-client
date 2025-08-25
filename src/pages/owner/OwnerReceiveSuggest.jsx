import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import GroupCard from '../../components/common/cards/GroupCard'
import { useNavigate } from 'react-router-dom'
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox'
import useStudentOrgStore from '../../stores/studentOrgStore'
import Menu from '../../layout/Menu'
import StatusBtn from '../../components/common/buttons/StatusBtn'
import { fetchProposal, editProposalStatus } from '../../services/apis/proposalAPI'
import { getOwnerProfile } from '../../services/apis/ownerAPI'
import ProposalCard from '../../components/common/cards/ProposalCard'
import { fetchGroupProfile } from '../../services/apis/groupProfileAPI'


const OwnerReceiveSuggest = () => {
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


  const [proposalGroups, setProposalGroups] = useState([]);

  // 제안서 데이터를 student-group 형태로 변환 (비동기 처리)
  useEffect(() => {
    const fetchProposalGroups = async () => {
      if (receivedProposals.length === 0) return;

      const groupsWithProfiles = await Promise.all(
        receivedProposals.map(async (proposal) => {
          const groupId = proposal.author.id;
          
          console.log('제안서 ID:', proposal.id, '학생단체 정보:', groupId);

          const groupProfile = await fetchGroupProfile(groupId);

          console.log('학생 단체 정보', groupProfile);
          
          return {


            proposalId: proposal.id,
            status: proposal.current_status,
            created_at: proposal.created_at,
            receivedDate: new Date(proposal.created_at).toLocaleDateString('ko-KR'),
            ...(groupProfile || {}) // groupProfile이 null인 경우 빈 객체로 처리
          };
        })
      );

      setProposalGroups(groupsWithProfiles);
      console.log("데이터 확인", groupsWithProfiles);
    };

    fetchProposalGroups();
  }, [receivedProposals]);

  console.log("받은 제안서 데이터", proposalGroups); // proposalGroups가 학생단체 프로필 + 제안서 데이터 합친 배열

  // 상태별 필터링된 제안서 목록
  const filteredProposalGroups = selectedStatus 
    ? proposalGroups.filter(group => group.status === selectedStatus)
    : proposalGroups;

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
      <ContentContainer>
        <Menu />
        <Loading>로딩중...</Loading>
      </ContentContainer>
    );
  }


  const handleProposalClick = async (proposalGroups) => {
    console.log("클릭된 organization:", proposalGroups);
    
    try {
      // 제안서 상태를 READ로 변경
      if (proposalGroups.status === 'UNREAD') {
        await editProposalStatus(proposalGroups.proposalId, { status: 'READ', comment: '' });
  
        // 로컬 상태도 업데이트
        setReceivedProposals(prevProposals => 
          prevProposals.map(proposal => 
            proposal.id === proposalGroups.proposalId 
              ? { ...proposal, current_status: 'READ' }
              : proposal
          )
        );
      }
    } catch (error) {
      console.error('제안서 상태 변경 실패:', error);
    }
    
    // 클릭 시 제안서 상세 페이지로 이동
    navigate(`/owner/mypage/received-proposal/${proposalGroups.proposalId}`, { 
      state: { proposalId: proposalGroups.proposalId, proposalGroups } 
    });
  }

  // const handleProposalClick = async (proposalGroup) => {
  //   try {
  //     // UNREAD 상태인 경우 READ로 변경
  //     if (proposalGroup.status === 'UNREAD') {
  //       // API 호출하여 상태 업데이트
  //       await editProposalStatus(proposalGroup.id, { status: 'READ' });
        
  //       // 로컬 상태 업데이트
  //       setProposalGroups(prevGroups => 
  //         prevGroups.map(group => 
  //           group.id === proposalGroup.id 
  //             ? { ...group, status: 'READ' }
  //             : group
  //         )
  //       );
        
  //       // summaryStats 업데이트
  //       setSummaryStats(prevStats => ({
  //         ...prevStats,
  //         unread: prevStats.unread - 1,
  //         read: prevStats.read + 1
  //       }));
  //     }
      
  //     // 네비게이션
  //     navigate(`/owner/mypage/received-proposal/${proposal.id}`, { 
  //       state: { proposal, proposalGroups } 
  //     });
  //   } catch (error) {
  //     console.error('제안서 상태 업데이트 실패:', error);
  //     // 에러가 발생해도 네비게이션은 진행
  //     // navigate(`/owner/mypage/received-proposal/${proposalGroup.id}`, { 
  //     //   state: { proposal: proposalGroup, proposalGroups } 
  //     // });
  //   }
  // }



  return (
    <PageContainer>
      <Menu />
      <ContentContainer>
        <SuggestSummaryBox 
          items={summaryItems} 
          onItemClick={handleStatusClick}
          selectedStatus={selectedStatus}
        />
 
        {filteredProposalGroups.length > 0 ? (
          <CardListGrid> 
          {filteredProposalGroups.map((group) => (
            <ProposalCard
              key={group.id}
              proposalGroup={group}
              onClick={handleProposalClick}

            />
          ))
        }
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

export default OwnerReceiveSuggest

// 그리드 가로 3, 세로 자동
const CardListGrid = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 447px); 
  justify-content: center;
  align-content: center;
  column-gap: 20px;
  row-gap: 13px;
  text-align: left;
  font-size: 18px;
  color: #1A2D06;
  font-family: Pretendard;
`;

// const ScrollSection = styled.div`
// display: flex;
// flex-direction: column;
// align-items: flex-start;
// width: 100%;
// position: relative;
// justify-content: flex-start; 
// min-height: 100vh; /* 화면 높이 채워야 위에서 시작할 수 있구나 .. ㅠ */
// `;

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
color: #1A2D06;
font-weight: 600;
font-size: 16px;
justify-content: center;
align-content: center;
padding : 200px;
 
`;
