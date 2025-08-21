import { useState, useEffect } from "react";
import useUserStore from "../stores/userStore";
import { getOwnerProfile } from "../services/apis/ownerAPI";

const useOwnerProfile = () => {
 const { userId } = useUserStore();
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [profileId, setProfileId] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeType, setStoreType] = useState("");
  const [menuNames, setMenuNames] = useState([]);
  const [storeImage, setStoreImage] = useState([]);
  const [contactInfo, setContactInfo] = useState("");
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!userId) return;

      try {
        const profile = await getOwnerProfile(userId);

        setOwnerProfile(profile);
        setStoreName(profile.profile_name);
        setProfileId(profile.id);
        setContactInfo(profile.contact);

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

        console.log(profile.photos);

        if (Array.isArray(profile.photos) && profile.photos.length > 0) {
        setStoreImage(profile.photos[0].image); 
        } else {
        setStoreImage(null);
        }

        console.log("ownerProfile", profile);
      } catch (err) {
        console.error("프로필을 가져오는 데 실패했습니다:", err);
        setError(err);
      } 
    };

    fetchOwnerData();
  }, [userId]);

  return { ownerProfile, profileId, storeName, storeType, menuNames, storeImage, contactInfo, error };
};

export default useOwnerProfile;
