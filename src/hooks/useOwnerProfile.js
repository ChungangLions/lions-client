import { useState, useEffect } from "react";
import useUserStore from "../stores/userStore";
import { getOwnerProfile } from "../services/apis/ownerAPI";

const useOwnerProfile = () => {
  const { ownerId } = useUserStore();
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [storeName, setStoreName] = useState("");
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

        if (Array.isArray(profile.menus)) {
          setMenuNames(profile.menus.map(menu => menu.name));
        } else {
          setMenuNames([]);
        }

        if (Array.isArray(profile.photos)) {
          setStoreImage(profile.photos.map(photo => photo[0]));
        } else {
          setStoreImage([]);
        }
      } catch (err) {
        console.error("프로필을 가져오는 데 실패했습니다:", err);
        setError(err);
      } 
    };

    fetchOwnerData();
  }, [ownerId]);

  return { ownerProfile, storeName, menuNames, storeImage, error };
};

export default useOwnerProfile;
