export const AppRoutes = {
  reception: {
    root: '/reception',

    patients: {
      root: '/reception/patients',
      add: '/reception/patients/add',
      edit: (id: number | string) => `/reception/patients/edit/${id}`,
      view: (id: number | string) => `/reception/patients/view/${id}`,
    },

    tickets: {
      root: '/reception/tickets',
      create: (patientId: number | string) => `/reception/tickets/create/${patientId}`,
      print: (ticketId: number | string) => `/reception/tickets/print/${ticketId}`,
    }
  }
};
