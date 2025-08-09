import React from 'react'
import styled from 'styled-components'
import ProfileImage from './ProfileImage'
import { FaIndustry } from 'react-icons/fa6'

const OwnerInfo = () => {
  return (
    <InfoSection>
        <InfoWrapper>
            <ProfileImage />
            <ContentWrapper>
                <TitleSection>
                    <Title>
                        Middle Door
                    </Title>
                    <Industry>
                        카페 및 디저트
                    </Industry>
                </TitleSection>
                <MenuSection>
                    <Title>
                        대표메뉴
                    </Title>
                    <MenuItem>
                        아메리카노, 수박주스, 바스트치즈케이크 등
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
background-color: #d9d9d9;
height: 149px;
display: flex;
flex-direction: column;
padding: 20px 41px;
box-sizing: border-box;
text-align: left;
font-size: 20px;
color: #000;
font-family: Pretendard;
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
color: #000;
font-family: Pretendard;
`;

const ContentWrapper = styled.div`
width: 334px;
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
gap: 8px;
`;

const MenuSection = styled.div`
align-self: stretch;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 8px;
font-size: 16px;
color: #717171;
`;

const Title =styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
`;

const Industry =styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
font-size: 16px;
color: #717171;
`;

const MenuItem = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
color: #000;
`;