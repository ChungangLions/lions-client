import { useState, useEffect } from "react";
import useUserStore from "../stores/userStore";
import { fetchGroupProfile } from "../services/apis/groupProfileAPI";

// userId 대신 groupId를 props로 
const useGroupProfile = (groupProfileId) => { 
  const [groupProfile, setGroupProfile] = useState(null);
  const [profileId, setProfileId] = useState("");
  const [groupDepartment, setGroupDepartment] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState([]);
  const [termStart, setTermStart] = useState("");
  const [termEnd, setTermEnd] = useState("");
  const [partnershipStart, setPartnershipStart] = useState("");
  const [partnershipEnd, setPartnershipEnd] = useState("");
  const[university, setUniversityName] = useState("");
  const [contact, setContact ] = useState("");
  const [partnershipCount, setPartnershipCount] = useState("");
  const [studentSize, setStudentSize] = useState("");
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupProfileId) return;

      try {
        const profile = await fetchGroupProfile(groupProfileId);

        setGroupProfile(profile);
        setGroupDepartment(profile.department);
        setGroupName(profile.council_name);
        setProfileId(profile.id);
        setTermStart(profile.term_start);
        setTermEnd(profile.term_end);
        setPartnershipStart(profile.partnership_start);
        setPartnershipEnd(profile.partnership_end);
        setPartnershipCount(profile.partnership_count);
        setUniversityName(profile.university_name);
        setContact(profile.contact);
        setStudentSize(profile.student_size);

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
  }, [groupProfileId]);

  return { studentSize, groupProfile, profileId, groupDepartment, groupName, groupImage, partnershipEnd, partnershipStart, termEnd, termStart, partnershipCount, contact, university, error };
};

export default useGroupProfile;