import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox'
import useStudentOrgStore from '../../stores/studentOrgStore'
import Menu from '../../layout/Menu'
import { fetchProposal, editProposalStatus } from '../../services/apis/proposalAPI'
import StatusBtn from '../../components/common/buttons/StatusBtn'
import useGroupProfile from '../../hooks/useOrgProfile'
import { fetchGroupProfile, getGroupProfile } from '../../services/apis/groupProfileAPI'

const OwnerSendSuggest = () => {
  const navigate = useNavigate();
  const [sentProposals, setSentProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    draft: 0,
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
          draft: 0,
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
              stats.draft++;
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


  // proposal.recipient.id => 학생단체 프로필 아이디 
  const [ groupId, setGroupId] = useState('');

  // 학생 단체 프로필 아이디의 배열
  const groupIds = useMemo(() => {
    return sentProposals.map(p => {
      const recipient = p.recipient || {};
      // recipient가 객체일 때 id 사용, 아니면 값 자체 사용
      return recipient.id != null ? recipient.id : recipient;
    });
  }, [sentProposals]);
  console.log("학생 단체 아이디", groupIds);
  console.log("sentProposals:", sentProposals);

  // 가져온 학생 단체 프로필 아이디로 학생 단체 배열 생성
  const [groupProfiles, setGroupProfiles] = useState([]);

useEffect(() => {
  const fetchProfiles = async () => {
    try {
      if (groupIds.length === 0) return;

      const profiles = await Promise.all(
        groupIds.map(id => fetchGroupProfile(id))
      )

      setGroupProfiles(profiles);
      console.log("학생단체프로필", profiles);
      console.log("profiles 길이:", profiles.length);
      console.log("sentProposals 길이:", sentProposals.length);
    } catch (err) {
      console.error("학생 단체 프로필 가져오기 실패:", err);
    }
  };

  fetchProfiles();
}, [groupIds]);

console.log(sentProposals);

const proposalOrganizations = useMemo(() => {
  return groupProfiles.map((profile, index) => {
    const proposal = sentProposals[index]; // 같은 순서의 proposal 꺼내기

    // profile이 null이거나 proposal이 없으면 건너뛰기
    if (!profile || !proposal) {
      return null;
    }

    return {
      ...profile,
      id: proposal?.id || null, // 제안서 id
      status: proposal?.current_status || null, // 제안서 상태
      created_at: proposal
        ? new Date(proposal.created_at).toLocaleDateString('ko-KR')
        : null, // 생성일
      receivedDate: proposal
        ? new Date(proposal.created_at).toLocaleDateString('ko-KR')
        : null, // 받은 날짜 (created_at과 같다면 중복 제거 가능)
      // recipient 정보 추가 - 제안서의 recipient 정보를 포함
      recipient: proposal?.recipient || null,
      // 제안서의 상세 정보들도 포함
      partnership_type: proposal?.partnership_type || null,
      apply_target: proposal?.apply_target || null,
      benefit_description: proposal?.benefit_description || null,
      time_windows: proposal?.time_windows || null,
      partnership_period: proposal?.partnership_period || null,
      contact_info: proposal?.contact_info || null,
    };
  }).filter(Boolean); // null 값 제거
}, [groupProfiles, sentProposals]);

console.log(proposalOrganizations);




  const summaryItems = [
    { count: summaryStats.draft, label: '작성중'},
    { count: summaryStats.read, label: '열람' },
    { count: summaryStats.unread, label: '미열람' },
    { count: summaryStats.partnership, label: '제휴 체결' },
    { count: summaryStats.rejected, label: '거절' },

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
    REJECTED: "거절",
    DRAFT: "작성중"
  };

  // proposal.id로 제안서 정보 접근 가능
  
  const handleProposalClick = async (proposalOrganizations) => {
    console.log("클릭된 organization:", proposalOrganizations);
    
    // try {
    //   // 제안서 상태를 READ로 변경
    //   if (proposalOrganizations.status === 'UNREAD') {
    //     await editProposalStatus(proposalOrganizations.id, { status: 'READ', comment: '' });
  
        
    //     // 로컬 상태도 업데이트
    //     setSentProposals(prevProposals => 
    //       prevProposals.map(proposal => 
    //         proposal.id === proposalOrganizations.id 
    //           ? { ...proposal, current_status: 'READ' }
    //           : proposal
    //       )
    //     );
    //   }
    // } catch (error) {
    //   console.error('제안서 상태 변경 실패:', error);
    // }
    
    // 클릭 시 제안서 상세 페이지로 이동
    navigate(`/owner/mypage/sent-proposal/${proposalOrganizations.id}`, { 
      state: { proposalOrganizations } 
    });
  }

  console.log(proposalOrganizations);



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