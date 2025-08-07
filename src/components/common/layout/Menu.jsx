import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Menu = () => {
    return (
        <MenuContainer>
            <MenuItem to="/owner/mypage"> 프로필 </MenuItem>
            <MenuItem to="/owner/mypage/suggest-form"> 제안서 </MenuItem>
            <MenuItem to="/owner/mypage/received-suggest"> 받은 제안 </MenuItem>
            <MenuItem to="/owner/mypage/sent-suggest"> 보낸 제안 </MenuItem>
            <MenuItem to="/owner/mypage/wishlist"> 찜 목록 </MenuItem>
        </MenuContainer>
    )
}

export default Menu

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
    width: 100%;
    height: 100%;
`;

const MenuItem = styled(Link) `
    display: block;
    padding: 10px;
`;