import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ProfileImage from './ProfileImg'
import { FaIndustry } from 'react-icons/fa6'
import useOwnerProfile from '../../../hooks/useOwnerProfile'
import useUserStore from '../../../stores/userStore'

// profileData는 groupproposalDeatil.jsx에서 넘어옴 
const OwnerInfo = ({profileData}) => {
    const { storeName, storeType, menuNames, storeImage, error } = useOwnerProfile();

    const [ownertype, setOwnerType] = useState('');
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        if (!profileData) return;

        if (profileData.business_type === 'RESTAURANT') {
            setOwnerType("일반 음식점");
        } else if (profileData.business_type === 'CAFE') {
            setOwnerType("카페 및 디저트");
        } else if (profileData.business_type === 'BAR') {
            setOwnerType("주점");
        } else {
            setOwnerType("기타");
        }

        if (Array.isArray(profileData.menus)) {
            setMenus(profileData.menus.map(menu => menu.name).join(', '));
        } else {
            setMenus([]);
        }
        }, [profileData]);

  return (
    <InfoSection>
        <InfoWrapper>
            {!profileData  
            ? <ProfileImage profileImage={storeImage}/>
            : <ProfileImage profileImage ={profileData.photos[0].image}/>
            }
            <ContentWrapper>
                <TitleSection>
                    <Title>
                    {!profileData ? storeName : profileData.profile_name}
                    </Title>
                    <Industry>
                    {!profileData ? storeType : ownertype}
                    </Industry>
                </TitleSection>
                <MenuSection>
                    <MenuTitle>
                    대표메뉴
                    </MenuTitle>
                    <MenuItem>
                    {!profileData ? menuNames : menus } 등
                    </MenuItem>
                </MenuSection>

            </ContentWrapper>
        </InfoWrapper>
    </InfoSection>
  )
}

export default OwnerInfo

const InfoSection =styled.div`
position: relative;
background-color: #eff6df;
height: 149px;
display: flex;
flex-direction: column;
padding: 20px 41px;
box-sizing: border-box;
text-align: left;
font-size: 20px;
color: #1A2D06
font-family: Pretendard;
width: 100%;
`;

const InfoWrapper = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 30px;
text-align: left;
font-size: 20px;
font-family: Pretendard;
`;

const ContentWrapper = styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 25px;
`;

const TitleSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 12px;
width: 100%;
`;

const MenuSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 8px;
font-size: 16px;
color: #898989;
width: 100%;
`;

const Title =styled.div`
display: flex;
flex-direction: row;
color : #1A2D06;
font-weight: 600;
white-space: nowrap;
`;

const MenuTitle =styled.div`
display: flex;
flex-direction: row;
color : #717171;
`;

const Industry =styled.div`
display: flex;
flex-direction: row;
font-size: 16px;
color: #717171;
white-space: nowrap;
`;

const MenuItem = styled.div`
display: flex;
flex-direction: row;
color : #1A2D06;
`;