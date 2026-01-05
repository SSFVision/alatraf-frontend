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
      select: 'reception/patients/select',

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
      `paid/${paymentId}/${paymentReference}`,
  },
  patientCards: {
    root: 'patient-cards',

    wounded: {
      root: 'patient-cards/wounded',

      list: 'patient-cards/wounded',

      create: 'patient-cards/wounded/create',

      edit: (woundedCardId: number | string) =>
        `patient-cards/wounded/edit/${woundedCardId}`,

      view: (woundedCardId: number | string) =>
        `patient-cards/wounded/view/${woundedCardId}`,
    },

    disabled: {
      root: 'patient-cards/disabled',

      list: 'patient-cards/disabled',

      create: 'patient-cards/disabled/create',

      edit: (disabledCardId: number | string) =>
        `patient-cards/disabled/edit/${disabledCardId}`,

      view: (disabledCardId: number | string) =>
        `patient-cards/disabled/view/${disabledCardId}`,
    },
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
    doctors: {
      viewDoctorAssigments: (doctorSectionRoomId: number | string) =>
        `therapy-cards/doctors/${doctorSectionRoomId}/assigments`,
    },
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
    doctors: {
      viewIndustrialParts: (doctorSectionRoomId: number | string) =>
        `repair-cards/doctors/${doctorSectionRoomId}`,
    },
    // عمليات سريعة (عادة dialogs أو inline forms)
    status: (repairCardId: number | string) =>
      `repair-cards/${repairCardId}/status`,

    deliveryTime: (repairCardId: number | string) =>
      `repair-cards/${repairCardId}/delivery-time`,
  },

  Appointment: {
    root: 'appointments',
    waaitngPatients: 'waiting-patients',
    manage: 'manage',
    changeStatus: (appointmentId: number | string) =>
      `manage/change-status/${appointmentId}`,
    addHoliday: 'new/holiday',
    schedule: (ticketId: number | string, patientId: number | string) =>
      `waiting-patients/schedule/${ticketId}/patient/${patientId}`,
    reschedule: (patientId: number | string) => `reschedule/${patientId}`,
  },
  medicalPrograms: {
    root: 'medical-programs',

    list: 'medical-programs',

    create: 'create',

    edit: (medicalProgramId: number | string) => `edit/${medicalProgramId}`,

    view: (medicalProgramId: number | string) => `view/${medicalProgramId}`,
  },
  industrialParts: {
    root: 'industrial-parts',

    list: 'industrial-parts',

    create: 'create',

    edit: (industrialPartId: number | string) => `edit/${industrialPartId}`,

    view: (industrialPartId: number | string) => `view/${industrialPartId}`,
  },
  sections: {
    root: 'sections',

    list: 'sections',

    create: 'create',

    edit: (sectionId: number | string) => `edit/${sectionId}`,

    view: (sectionId: number | string) => `view/${sectionId}`,
  },
  services: {
    root: 'services',

    list: 'services',

    create: 'create',

    edit: (serviceId: number | string) => `edit/${serviceId}`,

    view: (serviceId: number | string) => `view/${serviceId}`,
  },
  doctors: {
    root: 'doctors',
    list: 'doctors',
    create: 'create',
    edit: (doctorId: number | string) => `edit/${doctorId}`,
    view: (doctorId: number | string) => `view/${doctorId}`,
    assign: (doctorId: number | string) => `assign/${doctorId}`,
  },
  rooms: {
    root: 'rooms',
    create: 'create',

    edit: (roomId: number | string) => `edit/${roomId}`,

    view: (roomId: number | string) => `view/${roomId}`,
  },

  dashboard: {
    root: 'dashboard',
  },
  users: {
    root: 'users',

    list: 'users',

    create: 'create',

    edit: (userId: number | string) => `edit/${userId}`,

    view: (userId: number | string) => `view/${userId}`,

    permissions: (userId: number | string) => `${userId}/permissions`,
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
