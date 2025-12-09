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
      create: (patientId: number | string) =>
        `industrial/Patient/${patientId}/create`,
      view: (diagnosisId: number | string) => `industrial/view/${diagnosisId}`,
      edit: (diagnosisId: number | string) => `industrial/edit/${diagnosisId}`,
    },
  },

  finance: {
    root: 'finance',
    paied: (patientId: number | string) => `paied/${patientId}`,
  },
  Appointment: {
    root: 'appointments',
    addHoliday: 'new/holiday',
    schedule: (patientId: number | string) => `schedule/${patientId}`,
    reschedule: (patientId: number | string) => `reschedule/${patientId}`,
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
