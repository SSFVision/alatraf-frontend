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
    THERAPY: {
      VIEW: 'view_therapy_diagnosis',
      ADD: 'add_therapy_diagnosis',
      UPDATE: 'update_therapy_diagnosis',
      DELETE: 'delete_therapy_diagnosis',
    },

    INDUSTRIAL: {
      VIEW: 'view_industrial_diagnosis',
      ADD: 'add_industrial_diagnosis',
      UPDATE: 'update_industrial_diagnosis',
      DELETE: 'delete_industrial_diagnosis',
    },
  },
  PAYMENTS: {
    VIEW: 'view_payment',
    ADD: 'add_paied',
  },

  Appointment: {
    VIEW: 'appointment:read',
    Schedule: 'appointment:schedule',
    ReSchedule: 'appointment:reschedule',
    AddHoliday: 'holiday:create',
  },
  THERAPY_CARDS: {
    VIEW: 'THERAPY_CARDS:View',
    ASSIGN_DOCTORS: 'assign_therapy_card_doctors',
  },

  THERAPY_SESSIONS: {
    VIEW: 'view_therapy_session',
    ADD: 'add_therapy_session',
    UPDATE: 'update_therapy_session',
    DELETE: 'delete_therapy_session',
  },
} as const;
