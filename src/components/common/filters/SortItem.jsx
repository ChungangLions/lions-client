// 제휴 이력 on off 같은 필터
import React from 'react'
import usefilterStore from '../../../stores/filterStore';
import FilterBtn from '../buttons/FilterBtn';

const SortItem = () => {
  const filterByRecordToggle = usefilterStore(state => state.filterByRecordToggle);
  const orglistFiltered = usefilterStore(state => state.orglistFiltered);

  return (
    <FilterBtn onClick={() => filterByRecordToggle('orglist')}>
      {orglistFiltered ? '제휴 이력 해제' : '제휴 이력'}
    </FilterBtn>
  )
}

export default SortItem