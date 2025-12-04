import { Patient } from './../../mocks/patients/patient.dto';
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

  // doctor: {
  //   root: 'doctor',
  //   diagnosis: {
  //     root: 'doctor/diagnosis',
  //     create: (patientId: number | string) =>
  //       `doctor/diagnosis/create/${patientId}`,
  //     view: (id: number | string) => `doctor/diagnosis/view/${id}`,
  //   },
  // },

  diagnosis: {
    root: 'diagnosis',

    therapy: {
      root: 'therapy',
      create: (patientId: number | string) => `therapy/create/${patientId}`,
      view: (diagnosisId: number | string) => `therapy/view/${diagnosisId}`,
      edit: (diagnosisId: number | string) => `therapy/edit/${diagnosisId}`,
    },

    industrial: {
      root: 'industrial',
      create: (patientId: number | string) => `industrial/Patient/${patientId}/create`,
      view: (diagnosisId: number | string) => `industrial/view/${diagnosisId}`,
      edit: (diagnosisId: number | string) => `industrial/edit/${diagnosisId}`,
    },
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
