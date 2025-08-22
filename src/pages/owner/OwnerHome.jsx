import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import useStudentOrgStore from '../../stores/studentOrgStore'
import FilterBtn from '../../components/common/filters/FilterBtn'
import { TbArrowsSort } from "react-icons/tb";
import DropDown from '../../components/common/filters/DropDown'
import useUserStore from '../../stores/userStore'
import { fetchLikes } from '../../services/apis/likesapi'

const OwnerHome = () => {
  const navigate = useNavigate();
  

  // const handleCardClick = (organization) => {
  //   navigate(`/owner/student-group-profile`, { state: { userType: "owner", organization } });

  const handleCardClick = (organization, id) => {
    navigate(`/owner/student-group-profile/${organization.id}`, { state: { userType: "owner", organization } });

  };

  const [isActive, setIsActive] = useState(false);

  const { isLoggedIn, userId } = useUserStore();

  useEffect(() => {
    if (isLoggedIn === false) {
      alert('로그아웃 되었습니다. 다시 로그인 해주세요.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // zustand store에서 사용할 것들 가져오기 
    const {
    organizations,
    sortByDesc,
    filterByRecord,
    fetchAndSetOrganizations,
  } = useStudentOrgStore();

  // 학생단체 목록 불러오기
  useEffect(() => {
    fetchAndSetOrganizations();
  }, [fetchAndSetOrganizations]);

  const handleFilterChange = (e) => {
      setIsActive(!isActive);
      filterByRecord();
  }


  // 찜 기능 
  const [likes, setLikes] = useState([]);
  const [likeStores, setLikeStores] = useState([]);



 
    useEffect(() => {
      fetchAndSetOrganizations();
      const fetchUserLikes = async () => {
        const list = await fetchLikes('given');
        setLikeStores(list.map(item => item.target.id));
        console.log("좋아요한 가게 리스트:", list);
        console.log("좋아요한 가게 ID배열:", list.map(item => item.target.id));
      };
      fetchUserLikes();
    }, []);


  
  return (
    <PageConatainer>
      <SelectContainer>
        <SelectWrapper>
        <FilterBtn onClick = {handleFilterChange} active={isActive}>{`제휴 이력`}</FilterBtn>
        <OptionWrapper>
          <TypeWrapper>정렬</TypeWrapper>
            <TbArrowsSort size={30} strokeWidth={1} stroke={'#70AF19'} />
            <DropDown
              options={[
                { value: "likes", label: "찜 많은 순" },
                { value: "record", label: "제휴 이력 많은 순" },
              ]}
              onClick= {(option) => sortByDesc(option.value)}
            />
          </OptionWrapper>
        </SelectWrapper>
      </SelectContainer>
      <CardListGrid> 
        {organizations.map((organization) => (
          <OrgCardSection
            key={organization.id}
            onClick={handleCardClick}
            cardType={'home'}
            ButtonComponent={() => (
              <FavoriteBtn 
                userId={organization.id} 
                isLikeActive={likeStores.includes(organization.id)} // 추가!
              />
            )}
            organization={organization}
            userId={userId}
          />
        ))}
      </CardListGrid>
    </PageConatainer>
  )
}


export default OwnerHome

const PageConatainer = styled.div`
display: flex;
flex-direction: column;
margin: 15px 29px;
gap: 15px;
width: 100%;
position: relative;
justify-content: flex-start; 
min-height: 100vh; /* 화면 높이 채워야 위에서 시작할 수 있구나 .. ㅠ */
`;

const SelectContainer = styled.div`
width: 100%;
text-align: left;
font-size: 16px;
color: #64a10f;
font-family: Pretendard;
`;

const SelectWrapper = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 23px;
text-align: left;
font-size: 16px;
color: #64a10f;
font-family: Pretendard;
`;

// 그리드 가로 자동, 세로 자동, 447*3이 최대
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

const OptionWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
gap: 5px;
`;

const TypeWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px 0px;
gap: 10px;
min-width: 28px;
max-width: 60px;
`;