// 사용시 참고 사항
// 구현 사항: 메뉴 레이아웃 + 클릭 시 해당 디자인 변경
// 유의 사항
// 1. margin 반영 안 되어있음 -> 페이지에서 전체 Container margin 30px로 지정하고 사용 바람
// 2. header에서 border 지정되어 있어서 margin-bottom만 지정함 (윗부분 border 없는 상태)

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const MENU_ITEMS = [
    { label: '프로필', to: '/owner/mypage' },
    { label: '받은 제안', to: '/owner/mypage/received-suggest' },
    { label: '보낸 제안', to: '/owner/mypage/sent-suggest' },
    { label: '찜 목록', to: '/owner/mypage/wishlist' },
];

const Menu = () => {
  const { pathname } = useLocation();

  return (
    <MenuContainer>
      {MENU_ITEMS.map(item => (
      <MenuItem
        key={item.to}
        to={item.to}
        $active={
          item.to === '/owner/mypage'
            ? pathname === '/owner/mypage' || pathname === '/owner/mypage/edit'
            : item.to === '/owner/mypage/wishlist'
            ? pathname.startsWith('/owner/mypage/wishlist')
            : pathname === item.to
        }
      >
        {item.label}
      </MenuItem>

      ))}
    </MenuContainer>
  );
};


export default Menu

const MenuContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    gap: 50px;
    border-bottom: 1px solid #BCBCBC;
    margin: 0 auto;
    
`;

const MenuItem = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 52px;
    height: 38px;
    text-decoration: none;
    color: ${({ $active }) => ($active ? '#64A10F' : '#BCBCBC')};
    border-bottom: ${({ $active }) => ($active ? '4px solid #64A10F' : 'none')};
    font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    margin-bottom: -1px;  // 클릭했을 때 아래 선 겹치도록 추가 설정해놓은 부분임 
    z-index: 1;           
    position: relative;
    transition: color 0.2s, border-bottom 0.2s;
`;
