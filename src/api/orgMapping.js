export function mapUserToOrg(user, idx) {
    return {
      id: user.id ?? idx,
      university: user.university || "알 수 없음",
      department: user.department || "",
      name: user.name || user.username || "",
      student_num: user.student_num || "0명",
      date: {
        start: user.start_date || user.created_at?.slice(0,7) || "",
        end: user.end_date || user.modified_at?.slice(0,7) || "",
      },
      period: user.period || null,
      record: user.record || 0,
      likes: user.likes_received_count || user.likes || 0,
      receivedDate: user.receivedDate || user.created_at?.slice(0,10) || "",
      writtenDate: user.writtenDate || user.created_at?.slice(0,10) || "",
    };
}

