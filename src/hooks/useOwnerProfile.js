import { useState, useEffect } from "react";
import useUserStore from "../stores/userStore";
import { getOwnerProfile } from "../services/apis/ownerAPI";

const useOwnerProfile = () => {
 const { userId } = useUserStore();
 const ownerId = userId
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [storeType, setStoreType] = useState("");
  const [menuNames, setMenuNames] = useState([]);
  const [storeImage, setStoreImage] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!ownerId) return;

      try {
        const profile = await getOwnerProfile(ownerId);

        setOwnerProfile(profile);
        setStoreName(profile.profile_name);

        if (profile.business_type === 'RESTAURANT'){
            setStoreType("일반 음식점")
        } else if (profile.business_type === 'CAFE'){
            setStoreType("카페 및 디저트")
        } else if (profile.business_type === 'BAR'){
            setStoreType("주점")
        } else setStoreType("기타");

        if (Array.isArray(profile.menus)) {
          setMenuNames(profile.menus.map(menu => menu.name).join(', '));
        } else {
          setMenuNames([]);
        }

        if (Array.isArray(profile.photos)) {
          setStoreImage(profile.photos.map(photo => photo[0]));
        } else {
          setStoreImage([]);
        }

        console.log("ownerProfile", profile);
      } catch (err) {
        console.error("프로필을 가져오는 데 실패했습니다:", err);
        setError(err);
      } 
    };

    fetchOwnerData();
  }, [ownerId]);

  return { ownerProfile, storeName, storeType, menuNames, storeImage, error };
};

export default useOwnerProfile;
