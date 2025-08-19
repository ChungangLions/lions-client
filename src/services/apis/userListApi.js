const BASE_URL = 'https://huniverse.p-e.kr';
const token = localStorage.getItem('access_token');

export async function fetchUserList() {
    try {
      const response = await fetch(`${BASE_URL}/api/accounts/users/`);
      console.log(response);
      if (!response.ok) {
        throw new Error("서버 에러: " + response.status);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("유저 데이터 불러오기 에러:", err);
      return [];
    }
}

export function mapUser(user, idx) {
    return {
      id: user.id ?? idx,
      name: user.name || user.username || "",
      email: user.email,
      role: user.user_role,
      date: {
        start: user.start_date || user.created_at?.slice(0,7) || "",
        end: user.end_date || user.modified_at?.slice(0,7) || "",
      },
      likes: {
        received: Number(user.likes_received_count) || user.likes || 0,
        received_from: user.liked_by, // id, username, user_role
        given: Number(user.likes_given_count) || user.likes || 0,
        given_to: user.liked_targets, // id, username, user_role
      },
      recommends: {
        received: Number(user.recommendations_received_count) || user.likes || 0,
        received_from: user.recommended_by, // id, username, user_role
        given: Number(user.recommendations_given_count) || user.likes || 0,
        given_to: user.recommended_targets, // id, username, user_role
      },
      receivedDate: user.receivedDate || user.created_at?.slice(0,10) || "",
      writtenDate: user.writtenDate || user.created_at?.slice(0,10) || "",
    };
}

// export async function fetchStudentList() {  안 쓸 수도 있을 것 같아서 일단 주석처리 해놓음
//   try {
//     const response = await fetch(`${BASE_URL}/api/profiles/students/`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//     });
//     console.log(response);
//     if (!response.ok) {
//       throw new Error("서버 에러: " + response.status);
//     }
//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.error("유저 데이터 불러오기 에러:", err);
//     return [];
//   }
// }

// export function mergeProfiles({ userList, studentProfiles, studentGroups, ownerProfiles }) {
//     return userList.map(user => {
//       let merged = { ...user }; // userList 공통 데이터
  
//       if (user.role === 'student') {
//         const stu = studentProfiles.find(s => s.user === user.id);
//         if (stu) merged = { ...merged, ...stu };
//       }
//       if (user.role === 'student-groups') {
//         const gp = studentGroups.find(g => g.user === user.id);
//         if (gp) merged = { ...merged, ...gp };
//       }
//       if (user.role === 'owner') {
//         const ow = ownerProfiles.find(o => o.user === user.id);
//         if (ow) merged = { ...merged, ...ow };
//       }
//       return merged;
//     });
// }