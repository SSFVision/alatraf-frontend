export const AppRoutes = {
  auth: {
    root: 'auth',
    login: 'auth/login',
  },

  reception: {
    root: 'reception',

    patients: {
      root: 'reception/patients',

      add: 'reception/patients/add',

      edit: (id: number | string) => `reception/patients/edit/${id}`,

      view: (id: number | string) => `reception/patients/view/${id}`,
    },

    tickets: {
      root: 'reception/tickets',

      create: (patientId: number | string) =>
        `reception/tickets/create/${patientId}`,

      print: (ticketId: number | string) =>
        `reception/tickets/print/${ticketId}`,
    },
  },

  diagnosis: {
    root: 'diagnosis',

    therapy: {
      root: 'therapy',
      create: (ticketId: number | string) => `therapy/create/${ticketId}`,
      view: (diagnosisId: number | string) => `therapy/view/${diagnosisId}`,
      edit: (diagnosisId: number | string) => `therapy/edit/${diagnosisId}`,
    },

    industrial: {
      root: 'industrial',
      create: (ticketId: number | string) =>
        `industrial/Patient/${ticketId}/create`,
      view: (diagnosisId: number | string) => `industrial/view/${diagnosisId}`,
      edit: (diagnosisId: number | string) => `industrial/edit/${diagnosisId}`,
    },
  },

  finance: {
    root: 'finance',
    paied: (paymentId: number | string, paymentReference: number | string) =>
      `paied/${paymentId}/${paymentReference}`,
  },

  therapyCards: {
    root: 'therapy-cards',
    details: (cardId: number | string) => `therapy-cards/${cardId}`,
    sessions: {
      list: (therapyCardId: number | string) =>
        `therapy-cards/${therapyCardId}/sessions`,

      create: (therapyCardId: number | string) =>
        `therapy-cards/${therapyCardId}/sessions/create`,

      edit: (therapyCardId: number | string, sessionId: number | string) =>
        `therapy-cards/${therapyCardId}/sessions/edit/${sessionId}`,
    },
    // doctors: {
    //   assign: (cardId: number | string) =>
    //     `therapy-cards/${cardId}/doctors`,
    // },
  },
  repairCards: {
    root: 'repair-cards',

    details: (cardId: number | string) => `repair-cards/${cardId}`,

    assignments: {
      // صفحة إدارة التعيينات (تشبه sessions list)
      list: (repairCardId: number | string) =>
        `repair-cards/${repairCardId}/assignments`,

      // تعيين كامل الكرت لطبيب
      assignCard: (repairCardId: number | string) =>
        `repair-cards/${repairCardId}/assignments/assign-card`,

      // تعيين قطع صناعية (industrial parts)
      assignParts: (repairCardId: number | string) =>
        `repair-cards/${repairCardId}/assignments/assign-parts`,
    },

    // عمليات سريعة (عادة dialogs أو inline forms)
    status: (repairCardId: number | string) =>
      `repair-cards/${repairCardId}/status`,

    deliveryTime: (repairCardId: number | string) =>
      `repair-cards/${repairCardId}/delivery-time`,
  },

  Appointment: {
    root: 'appointments',
    addHoliday: 'new/holiday',
    schedule: (patientId: number | string) => `schedule/${patientId}`,
    reschedule: (patientId: number | string) => `reschedule/${patientId}`,
  },
  medicalPrograms: {
  root: 'medical-programs',

  list: 'medical-programs',

  create: 'medical-programs/create',

  edit: (medicalProgramId: number | string) =>
    `medical-programs/edit/${medicalProgramId}`,

  view: (medicalProgramId: number | string) =>
    `medical-programs/view/${medicalProgramId}`,
},

  admin: {
    root: 'admin',
    dashboard: 'admin/dashboard',
  },

  management: {
    root: 'management',
    dashboard: 'management/dashboard',
  },

  system: {
    unauthorized: 'unauthorized',
    notFound: 'not-found',
  },
};
