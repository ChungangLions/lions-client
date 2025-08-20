import styled from 'styled-components';

const DetailCard = ({ title, content }) => {
    return (
        <Parent>
            <TitleWrapper>
                <Div>{title}</Div>
            </TitleWrapper>
            <ContentWrapper>
                {content}
            </ContentWrapper>
        </Parent>
    );
};

export default DetailCard;

// 각각 임기 / 인원 수 / 희망 제휴 기간 각각 
const Parent = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px; 
    width: 100%
`;

const TitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: 200px;
`;

const Div = styled.div`
    position: relative;
    font-weight: 600;
    width: 100px;
`;