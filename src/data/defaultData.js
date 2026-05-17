function createDefaultData() {
  const now = new Date().toISOString();

  return {
    metadata: {
      version: 1,
      createdAt: now,
      updatedAt: now
    },
    courses: [
      {
        code: "SIT753",
        title: "Professional Practice in IT",
        level: "postgraduate",
        active: true,
        createdAt: now,
        updatedAt: now
      },
      {
        code: "SIT223",
        title: "Professional Practice in Information Technology",
        level: "undergraduate",
        active: true,
        createdAt: now,
        updatedAt: now
      },
      {
        code: "SIT788",
        title: "Engineering AI Solutions",
        level: "postgraduate",
        active: true,
        createdAt: now,
        updatedAt: now
      }
    ],
    students: [
      {
        id: 1,
        name: "Quang Nguyen",
        email: "quang.nguyen@example.com",
        courseCode: "SIT753",
        status: "active",
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: "Minh Tran",
        email: "minh.tran@example.com",
        courseCode: "SIT223",
        status: "active",
        createdAt: now,
        updatedAt: now
      }
    ],
    counters: {
      studentId: 3
    }
  };
}

module.exports = createDefaultData;
