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

      edit: (id: number | string) =>
        `reception/patients/edit/${id}`,

      view: (id: number | string) =>
        `reception/patients/view/${id}`,
    },

    tickets: {
      root: 'reception/tickets',

      create: (patientId: number | string) =>
        `reception/tickets/create/${patientId}`,

      print: (ticketId: number | string) =>
        `reception/tickets/print/${ticketId}`,
    },
  },

  doctor: {
    root: 'doctor',
    dashboard: 'doctor/dashboard',
  },

  admin: {
    root: 'admin',
    dashboard: 'admin/dashboard',
  },

  management: {
    root: 'management',
    dashboard: 'management/dashboard',
  },

  finance: {
    root: 'finance',
    transactions: 'finance/transactions',
  },

  system: {
    unauthorized: 'unauthorized',
    notFound: 'not-found',
  },
};
