export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: 'view_dashboard',
  },

  PATIENTS: {
    VIEW: 'view_patient',
    ADD: 'add_patient',
    DELETE: 'delete_patient',
    UPDATE: 'update_patient',
  },
  TICKETS: {
  VIEW: 'view_ticket',
  ADD: 'add_ticket',
  DELETE: 'delete_ticket',
  UPDATE: 'update_ticket',
},
 DIAGNOSIS: {
    VIEW: 'view_diagnosis',
    ADD: 'add_diagnosis',
    UPDATE: 'update_diagnosis',
    DELETE: 'delete_diagnosis',
  },

} as const;
