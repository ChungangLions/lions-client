import { useState, useEffect } from "react";
import useUserStore from "../stores/userStore";
import { fetchGroupProfile } from "../services/apis/groupProfileAPI";

const useGroupProfile = () => {
 const { userId } = useUserStore();
  const [groupProfile, setGroupProfile] = useState(null);
  const [profileId, setProfileId] = useState("");
  const [groupDepartment, setGroupDepartment] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchGroupData = async () => {
      if (!userId) return;

      try {
        const profile = await fetchGroupProfile(userId);

        setGroupProfile(profile);
        setGroupDepartment(profile.department);
        setGroupName(profile.council_name);
        setProfileId(profile.id);

        console.log(profile.photos);

        if (Array.isArray(profile.photos) && profile.photos.length > 0) {
        setGroupImage(profile.photos[0].image); 
        } else {
        setGroupImage(null);
        }

        console.log("groupProfile", profile);
      } catch (err) {
        console.error("프로필을 가져오는 데 실패했습니다:", err);
        setError(err);
      } 
    };

    fetchGroupData();
  }, [userId]);

  return { groupProfile, profileId, groupDepartment, groupName, groupImage, error };
};

export default useGroupProfile;
