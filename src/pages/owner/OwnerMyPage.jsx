import React from 'react'
import styled from 'styled-components'
import Menu from '../../components/common/layout/Menu'
import MenuItem from '../../components/common/cards/MenuItem'
import ImageSlider from '../../components/common/cards/ImageSlider'
import { Link } from 'react-router-dom'

const menus = [
  { id: 1, image: 'img1.jpg', name: '메뉴', price: 5000 },
  { id: 2, image: 'img2.jpg', name: '메뉴', price: 5000 },
  { id: 3, image: 'img1.jpg', name: '메뉴', price: 5000 },
  { id: 4, image: 'img2.jpg', name: '메뉴', price: 5000 },
  { id: 5, image: 'img1.jpg', name: '메뉴', price: 5000 },
  { id: 6, image: 'img2.jpg', name: '메뉴', price: 5000 },
  { id: 7, image: 'img1.jpg', name: '메뉴', price: 5000 },
  { id: 8, image: 'img2.jpg', name: '메뉴', price: 5000 },
];

const infos = {
  partnershipNum: 7,
  likeNum: 46,
  recommendNum: 97,
  etc: ['정문 앞 500m', '매주 일요일 휴무', '단체 이용 가능 (최대 20인)'],
  partnershipType: ['할인형', '타임형'],
};

const OwnerMyPage = () => {
  return (
    <PageContainer>
      <Menu />

      {/* 타이틀 + 수정 버튼 section */}
      <TitleContainer>
        <TitleBox>
          <Title> Middle Door </Title>
          <DesBox>
            <Category> 카페 </Category>
            <Description> 베이커리가 다양하고 맛있는 디저트 카페 </Description>
          </DesBox>
        </TitleBox>
        <Link to="edit">
          <EditButton> 수정 </EditButton>
        </Link>
      </TitleContainer>

      {/* 중간 사진 section */}
      <ImageSlider />

      {/* 가게 정보 + 제휴 유형 + 대표 메뉴 section */}
      <ProfileContainer>
        <OwnerInfo>
          <InfoTitle>가게 정보</InfoTitle>
          <SumContainer>
            <SumBox>
              <div>제휴 이력</div>
              <div style={{fontWeight: '600'}}> {infos.partnershipNum} 회</div>
            </SumBox>
            <SumBox>
              <div>찜 수</div>
              <div style={{fontWeight: '600'}}> {infos.likeNum} 개</div>
            </SumBox>
            <SumBox>
              <div>추천 수</div>
              <div style={{fontWeight: '600'}}> {infos.recommendNum} 개</div>
            </SumBox>
          </SumContainer>
          <FurtherSum>
            {infos.etc.map((info, idx) => (
              <div key={idx}> ◻️ {info} </div>
            ))}
          </FurtherSum>

          <InfoTitle> 제휴 유형 </InfoTitle>
            <TypeCardList>
              {infos.partnershipType.map((type, idx) => (
                <TypeCard key={idx}>{type}</TypeCard>
              ))}
            </TypeCardList>
        </OwnerInfo>

        <OwnerMenu>
          <InfoTitle> 대표 메뉴 </InfoTitle>
          <MenuList>
            {menus.map(menu => (
              <MenuItem
                key={menu.id}
                image={menu.image} //임의로 fake box 넣어놓음, cards/menuitem에서 수정 필요
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
  width: 1380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const TitleContainer = styled.div`
  position: relative;
  padding: 0 20px;
  margin-top: 35px;
  margin-bottom: 25px;
  width: 100%;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const EditButton = styled.button`
  position: absolute;
  right: 40px;
  top: 25%;
  transform: translateY(-50%);

  font-size: 16px;
  font-weight: 400;
  // width: 38px;
  // height: 29px;
  padding: 5px;
  border: 1px solid #969696;
  background: #fff;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const DesBox = styled.div`
  display: flex;
  gap: 10px;
`;

const Category = styled.div `
  font-size: 16px;
  font-weight: 600;
  color: #616161;
`;

const Description = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #767676;
`;

// const ImageContainer = styled.div `
//   width: 100%;
//   height: 200px;
//   background: #ececec;
//   margin-bottom: 36px;
// `;

const ProfileContainer = styled.div`
  width: 100%;
  display: grid;
  gap: 50px;
  grid-template-columns: 1.4fr 1fr;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
`;

const OwnerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

// 통계
const SumContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  padding: 20px;
  // gap: 150px;
  border: 1px solid #818181;
`;

const SumBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const FurtherSum = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  gap: 10px;
`;

// 제휴 유형
const TypeCardList = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

const TypeCard = styled.div`
  width: 122px;
  height: 122.04px;
  border: 0.46px solid #000000;
  border-radius: 4.55px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 16px;
`;

// 대표 메뉴
const OwnerMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  // width: 100%;
`;

const MenuList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7.5px;
  // width: 100%;
`;