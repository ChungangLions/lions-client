import React from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox'
import useStudentOrgStore from '../../stores/studentOrgStore'
import Menu from '../../components/common/layout/Menu'
import ViewBtn from '../../components/common/buttons/ViewBtn'

const summaryItems = [
    { count: 5, label: '열람' },
    { count: 0, label: '미열람' },
    { count: 3, label: '제휴 체결' },
    { count: 1, label: '거절' }
];

const OwnerHome = () => {
  const navigate = useNavigate();

  const handleCardClick = () => { // 수정해야함!!
    navigate("proposal");
  };

  // zustand store에서 사용할 것들 가져오기 
  const {
    organizations,
  } = useStudentOrgStore();

  // 나중에 api 연결 후 사용
  // const organizations = useStudentOrgStore(state => state.organizations);
  // const fetchOrganizations = useStudentOrgStore(state => state.fetchAndSetOrganizations);
  // useEffect(() => {
  //   fetchOrganizations();
  // }, []);

  return (
    <ScrollSection>
      <Menu />
      <SuggestSummaryBox items={summaryItems} />
      <CardListGrid> 
        {organizations.map((organization) => (
          // 여기 detail 들어갈 거 props로 전달 필요 
          <OrgCardSection key={organization.id} onClick = {handleCardClick} cardType={'suggest-sent'} ButtonComponent ={ViewBtn} organization={organization} />
        ))}
      </CardListGrid>
    </ScrollSection>
  )
}


export default OwnerHome

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
