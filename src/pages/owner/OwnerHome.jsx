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
import { getOwnerProfile } from '../../services/apis/ownerAPI'

const OwnerHome = () => {
  const navigate = useNavigate();
  
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

  console.log(organizations);

    useEffect(() => {
      fetchAndSetOrganizations();
      const fetchUserLikes = async () => {
        const list = await fetchLikes('given');
        setLikeStores(list.map(item => item.target.id));
        console.log("좋아요한 학생회 리스트:", list);
        console.log("좋아요한 학생회 ID배열:", list.map(item => item.target.id));
      };
      fetchUserLikes();
    }, []);

  // useEffect(() => {
  //   fetchAndSetOrganizations();
  //   const fetchUserLikes = async () => {
  //     const list = await fetchLikes('given');
  //     console.log("찜 리스트 원본:", list);
  // console.log("첫 번째 요소:", list[0]);

  //     setLikes(list.map(item => item.target.id));
  //     console.log("찜 리스트:", list);
  //     console.log("찜한 단체 ID배열:", list.map(item => item.target.id));
  //   };
  //   fetchUserLikes();
  // }, []);


      {/* 사장님 프로필 상 학교와 같은 학교들만 표시 */}
      const [ownerCampus, setOwnerCampus] = useState(null);
      const [filteredOrganizations, setFilteredOrganizations] = useState([]);
      
      useEffect(() => {
        const fetchOwnerProfile = async() => {
          try {
            const ownerProfile = await getOwnerProfile(userId); // 사장님 프로필 가져오기 
            setOwnerCampus(ownerProfile?.campus_name);
            console.log('사장님 학교:', ownerProfile?.campus_name);  
          } catch (error) {
            console.error('사장님 프로필을 가져오는데 실패했습니다:', error);
          }
        };
        if (userId) {
          fetchOwnerProfile();
        }
      }, [userId]);  

      // 사장님 학교와 같은 학교의 학생단체들만 필터링
      useEffect(() => {

        if (ownerCampus && organizations.length > 0) {
          const filtered = organizations.filter(organization => {
            console.log('학생 단체 학교:', organization.university_name); // 중앙대 서울캠퍼스
            console.log('사장님 학교:', ownerCampus); // 중앙대학교
            return organization.university_name.includes(ownerCampus); // 
          });
          console.log('필터링된 조직들:', filtered);
          setFilteredOrganizations(filtered);
        } else {
          console.log('필터링 조건이 충족되지 않아 모든 학생단체 표시함');
          setFilteredOrganizations(organizations); 
        }
      }, [ownerCampus, organizations]);



  
  return (
    <PageConatainer>
      <SelectContainer>
        <SelectWrapper>
        <FilterBtn onClick = {handleFilterChange} active={isActive}>{`제휴 이력`}</FilterBtn>
        <OptionWrapper>
          {/* <TypeWrapper>정렬</TypeWrapper> */}
            <TbArrowsSort size={30} strokeWidth={1} stroke={'#70AF19'} />
            <DropDown
              options={[
                { value: "", label: "기본 순" },
                { value: "likes", label: "찜 많은 순" },
                { value: "record", label: "제휴 이력 많은 순" },
              ]}
              onClick= {(option) => sortByDesc(option.value)}
            />
          </OptionWrapper>
        </SelectWrapper>
      </SelectContainer>
      <CardListGrid> 
        {filteredOrganizations.length === 0 ? (
          <EmptyResultContainer>
            <EmptyResultText>검색 결과가 없습니다.</EmptyResultText>
          </EmptyResultContainer>
        ) : (
          filteredOrganizations.map((organization) => (
            <OrgCardSection
              key={organization.id}
              onClick={handleCardClick}
              cardType={'home'}
              ButtonComponent={() => (
                <FavoriteBtn 
                  userId={organization.user} 
                  isLikeActive={likeStores.includes(organization.user)} // 추가!
                />
              )}
              organization={organization}
              userId={userId}
            />
          ))
        )}
      </CardListGrid>
      <EmptyRow />
    </PageConatainer>
  )
}


export default OwnerHome

const PageConatainer = styled.div`
display: flex;
flex-direction: column;
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

const CardListGrid = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  align-content: center;
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

const EmptyRow = styled.div` // 여백 주기 위한 임시방편
display: flex;
height: 50px;
`;

const EmptyResultContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  grid-column: 1 / -1;
`;

const EmptyResultText = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  color: #898989;
  text-align: center;
`;