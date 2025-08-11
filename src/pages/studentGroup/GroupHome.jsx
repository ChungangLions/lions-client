// TO DO LIST
// 1. 주점 스티커 구현하기 (position: absolute)
//  ㄴ 업종별로 앞에 이모티콘 어떻게 구현할 지,,? type에서 바로 받아올 수 있나
// 2. 하트, 따봉 개수 구현하기
// 3. Best 여부 받아오기
// 4. Best 텍스트 구현하기 (position: absolute)
// 5. 우측 상단 하트 버튼 넣기

import React, { useState } from 'react'
import Header from '../../components/common/layout/Header'
import GroupCard from '../../components/common/cards/GroupCard';
import styled from 'styled-components';

const GroupList = Array.from({ length: 16 }, (_, idx) => ({
  id: idx + 1,
  imageUrl: '',
  title: '대관령',
  subtitle: '안주가 맛있는 감성 술집',
  type: '주점',
  favorite: 100,
  recommend: 100,
  like: false,
  best: true,
}));

const GroupHome = () => {
  const [groups, setGroups] = useState(GroupList);

  const handleLikeToggle = (groupId) => {
    setGroups(groups =>
      groups.map(g =>
        g.id === groupId ? { ...g, like: !g.like } : g
      )
    );
  };

  return (
    <PageContainer>
      <Header />
      <GridContainer>
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            imageUrl={group.imageUrl}
            title={group.title}
            subtitle={group.subtitle}
            type={group.type}
            favorite={group.favorite}
            recommend={group.recommend}
            like={group.like}
            onLikeClick={() => handleLikeToggle(group.id)}
            best={group.best}
          />
        ))}
      </GridContainer>
    </PageContainer>
  )
}

export default GroupHome;

const PageContainer = styled.div `
    margin: 30px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 15px; // 필터 ~ container 사이 여백 (필터 아직 구현 X)
`;