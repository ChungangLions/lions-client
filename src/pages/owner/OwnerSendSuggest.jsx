import React from 'react';
import SuggestItem from '../../components/common/cards/SuggestItem';
import styled from 'styled-components';
import Header from '../../components/common/layout/Header';
import Menu from '../../components/common/layout/Menu';
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox';

const summaryItems = [
    { count: 2, label: '작성 중'},
    { count: 5, label: '열람' },
    { count: 0, label: '미열람' },
    { count: 3, label: '제휴 체결' },
    { count: 1, label: '거절' }
];

const suggests = [
  {
    id: 1,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 2,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 3,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 4,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 5,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 6,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 7,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 8,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 9,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 10,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 11,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
  {
    id: 12,
    profileImage: '',
    school: '중앙대학교',
    department: '37대 경영학부 학생회',
    title: '다움',
    date: '2025.08.08'
  },
];

function OwnerSendSuggest() {
  return (
    <PageContainer>
        <Header />
        <Menu />
        <SuggestSummaryBox items={summaryItems} />
        <SuggestList>
        {suggests.map(suggest => (
            <SuggestItem
            key={suggest.id}
            profileImage={suggest.profileImage}
            school={suggest.school}
            department={suggest.department}
            title={suggest.title}
            date={suggest.date}
            dateLabel="작성일"
            />
        ))}
        </SuggestList>
    </PageContainer>
  );
}

export default OwnerSendSuggest;

const PageContainer = styled.div `
    margin: 30px;
`;

const SuggestList = styled.div`
    margin-top: 15px;
    gap: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    display: felx;
    align-items: space-between;
`;
