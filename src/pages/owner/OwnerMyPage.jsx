import React from 'react'
import Header from '../../components/common/layout/Header'
import styled from 'styled-components'
import Menu from '../../components/common/layout/Menu'
import MenuItem from '../../components/common/cards/MenuItem'

const menus = [
  { id: 1, image: 'img1.jpg', name: '아메리카노', price: 5000 },
  { id: 2, image: 'img2.jpg', name: '카페라떼', price: 5000 }, // 예시 메뉴뉴
];

const OwnerMyPage = () => {
  return (
    <PageContainer>
      <Header />
      <Menu />

      <TitleContainer>
        <TitleBox>
          <div> Middle Door </div>
          <div> 카페 베이커리가 다양하고 맛있는 디저트 카페 </div>
          </TitleBox>
        <EditButton> 수정 </EditButton>
      </TitleContainer>

      <ImageContainer>
        <div></div>
      </ImageContainer>

      <ProfileContainer>
        <OwnerInfo>
          <div>가게 정보</div>
          <SumContainer>
            <SumBox>
              <div>제휴 이력</div>
              <div>7회</div>
            </SumBox>
            <SumBox>
              <div>(서비스명) 별점</div>
              <div>4.1 / 5 (7)</div>
            </SumBox>
            <SumBox>
              <div>추천 수</div>
              <div>97개</div>
            </SumBox>
          </SumContainer>
          <div> ◻️ 정문 앞 500m </div>
          <div> ◻️ 매주 일요일 휴무 </div>
          <div> ◻️ 단체 이용 가능 (최대 20인) </div>

          <div> 제휴 유형 </div>
          {/* <TypeCard></TypeCard>
          <TypeCard></TypeCard> */}
        </OwnerInfo>

        <OwnerMenu>
          <div> 대표 메뉴 </div>
          <MenuList>
            {menus.map(menu => (
              <MenuItem
                key={menu.id}
                image={menu.image}
                name={menu.name}
                price={menu.price}
              />
            ))}
          </MenuList>
        </OwnerMenu>
      </ProfileContainer>
    </PageContainer>
  )
}

export default OwnerMyPage;

const PageContainer = styled.div`

`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TitleBox = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditButton = styled.button`
`;

const ImageContainer = styled.div `

`;

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
`;

const OwnerInfo = styled.div`
`;

const OwnerMenu = styled.div`

`;

const SumContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px;
  gap: 10px;
  border: 1px solid black;
`;

const SumBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuList = styled.div `
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
`;