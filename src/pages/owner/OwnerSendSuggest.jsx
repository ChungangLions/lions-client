// To-do list
// 1. 열람 미열람 얘네 박스 컴포넌트화를 해버릴까,,?

import React from 'react';
import SuggestItem from '../../components/common/cards/SuggestItem';
import styled from 'styled-components';
import Header from '../../components/common/layout/Header';
import Menu from '../../components/common/layout/Menu';

const suggests = [
  {
    id: 1,
    profileImage: '',
    school: '중앙대학교 3학년 경영학과 학생회',
    title: '다움',
    date: '2025.08.08'
  } // 예시 아이템
];

function OwnerSendSuggest() {
  return (
    <PageContainer>
        <Header />
        <Menu />
        <SumContainer>
            <SumBox>
                <div>5</div>
                <div>열람</div>
            </SumBox>
            <SumBox>
                <div>0</div>
                <div>미열람</div>
            </SumBox>
            <SumBox>
                <div>3</div>
                <div>제휴 체결</div>
            </SumBox>
            <SumBox>
                <div>1</div>
                <div>거절</div>
            </SumBox>
        </SumContainer>
        <SuggestList>
        {suggests.map(suggest => (
            <SuggestItem
            key={suggest.id}
            profileImage={suggest.profileImage}
            school={suggest.school}
            title={suggest.title}
            date={suggest.date}
            />
        ))}
        </SuggestList>
    </PageContainer>
  );
}

export default OwnerSendSuggest;

const PageContainer = styled.div ``;

const SumContainer = styled.div `
    display: flex;
    border: 1px solid black;
    justify-content: center;
    gap: 10px;
`;

const SumBox = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SuggestList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
`;

const SumInfo = styled.div `

`;