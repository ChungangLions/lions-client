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

  console.log(organizations);



 
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
            <TbArrowsSort size={30} strokeWidth={1} />
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
        {filteredOrganizations.map((organization) => (
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
