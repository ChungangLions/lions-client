import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { fetchUserList, fetchStudentList } from '../../api/userApi'
import { mergeProfiles } from '../../api/orgMapping'

const StudentMyPage = () => {
  const { id } = useParams();
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const userList = await fetchUserList();
      const studentProfiles = await fetchStudentList();
      const fullProfiles = mergeProfiles({ userList, studentProfiles });

      const myStudent = fullProfiles.find(  // 해당 id값을 가진 student에서 찾기
        profile => String(profile.id) === String(id)
      );
      if (myStudent) { // 일단 추천 목록은 실제로 데이터를 받아오거나, 더미 데이터로 대체
        setStudentInfo({
          name: myStudent.name,
          school: myStudent.university_name || myStudent.school || '',
          profileImg: myStudent.image || myStudent.profileImg || '',
          recommend: myStudent.recommend 
          || [
            { shopImg: '', shopName: '가게명' },
            { shopImg: '', shopName: '가게명' },
            { shopImg: '', shopName: '가게명' },
            { shopImg: '', shopName: '가게명' },
            { shopImg: '', shopName: '가게명' },
            { shopImg: '', shopName: '가게명' },
          ],
        });
      } else {
        setStudentInfo(null);
      }
    }
    loadProfile();
  }, [id]);

  // 로딩/에러 처리
  if (!studentInfo) {
    return <div>로딩 중 또는 학생 정보 없음</div>;
  }

  return (
    <PageContainer>
        <Contents>
            <ProfileContainer>
                <ProfileSection>
                    <ProfileImg>
                    {studentInfo.profileImg
                        ? <img src={studentInfo.profileImg} alt="profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        : null}
                    </ProfileImg>
                    <Name> {studentInfo.name} </Name>
                    <School> {studentInfo.school} </School>
                </ProfileSection>
                <EditButton> 수정하기 </EditButton>
            </ProfileContainer>
            <RecommendSection>
                <Name>추천 목록</Name>
                <ShopList>
                    {studentInfo.recommend.map((shop, idx) => (
                    <ShopCard key={idx}>
                        <ShopImg />
                        <ShopName>{shop.shopName}</ShopName>
                    </ShopCard>
                    ))}
                </ShopList>
            </RecommendSection>
        </Contents>
    </PageContainer>
  )
}

export default StudentMyPage;

const PageContainer = styled.div`
  width: 1380px;
  display: flex;
//   flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const Contents = styled.div`
    display: flex;
    width: 1340px;
    justify-content: space-between;
    align-items: center;
`;

const ProfileContainer = styled.div`
    display: flex;
    width: 363px;
    flex-direction: column;
    align-items: center;
    gap: 48px;
    flex-shrink: 0;
`;

const ProfileSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    align-self: stretch;
`;

const RecommendSection = styled.div`
    display: flex;
    width: 885px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    flex-shrink: 0;
`;

const ProfileImg = styled.div`
  width: 180px;
  height: 180px;
  background: #C9C9C9;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Name = styled.div`
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const School = styled.div`
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const EditButton = styled.button`
    display: flex;
    width: 203px;
    height: 40px;
    padding: 5px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #000;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    border: 1px solid #969696;
    background: white;
`;

const ShopList = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
`;

const ShopCard = styled.div`
    display: flex;
    width: 203px;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
`;

const ShopImg = styled.div`
    height: 137px;
    align-self: stretch;
    background: #D9D9D9;
`;

const ShopName = styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;