export const PERMISSIONS = {
  Person: {
    CREATE: 'person:create',
    READ: 'person:read',
    UPDATE: 'person:update',
    DELETE: 'person:delete',
  },

  Service: {
    CREATE: 'service:create',
    READ: 'service:read',
    UPDATE: 'service:update',
    DELETE: 'service:delete',
  },

  Ticket: {
    CREATE: 'ticket:create',
    READ: 'ticket:read',
    UPDATE: 'ticket:update',
    DELETE: 'ticket:delete',
    PRINT: 'ticket:print',
  },

  Appointment: {
    CREATE: 'appointment:create',
    RESCHEDULE: 'appointment:reschedule',
    READ: 'appointment:read',
    UPDATE: 'appointment:update',
    DELETE: 'appointment:delete',
    CHANGE_STATUS: 'appointment:change_status',
    PRINT: 'appointment:print',
  },

  Holiday: {
    CREATE: 'holiday:create',
    READ: 'holiday:read',
    UPDATE: 'holiday:update',
    DELETE: 'holiday:delete',
  },

  TherapyCard: {
    CREATE: 'therapyCard:create',
    READ: 'therapyCard:read',
    UPDATE: 'therapyCard:update',
    DELETE: 'therapyCard:delete',
    RENEW: 'therapyCard:renew',
    DAMAGE_REPLACEMENT: 'therapyCard:damage_replacement',
    CREATE_SESSION: 'therapyCard:create_session',
    READ_SESSION: 'therapyCard:read_session',
    PRINT_CARD: 'therapyCard:print_therapy_card',
    PRINT_SESSION: 'therapyCard:print_session',
  },

  RepairCard: {
    CREATE: 'repairCard:create',
    READ: 'repairCard:read',
    UPDATE: 'repairCard:update',
    DELETE: 'repairCard:delete',
    CHANGE_STATUS: 'repairCard:change_status',
    ASSIGN_TECHNICIAN: 'repairCard:assign_to_technician',
    CREATE_DELIVERY_TIME: 'repairCard:create_delivery_time',
    PRINT_CARD: 'repairCard:print_repair_card',
    PRINT_DELIVERY_TIME: 'repairCard:print_delivery_time',
  },

  IndustrialPart: {
    CREATE: 'industrialPart:create',
    READ: 'industrialPart:read',
    UPDATE: 'industrialPart:update',
    DELETE: 'industrialPart:delete',
  },

  Unit: {
    CREATE: 'unit:create',
    READ: 'unit:read',
    UPDATE: 'unit:update',
    DELETE: 'unit:delete',
  },

  MedicalProgram: {
    CREATE: 'medicalProgram:create',
    READ: 'medicalProgram:read',
    UPDATE: 'medicalProgram:update',
    DELETE: 'medicalProgram:delete',
  },

  Department: {
    CREATE: 'department:create',
    READ: 'department:read',
    UPDATE: 'department:update',
    DELETE: 'department:delete',
  },

  Section: {
    CREATE: 'section:create',
    READ: 'section:read',
    UPDATE: 'section:update',
    DELETE: 'section:delete',
  },

  Room: {
    CREATE: 'room:create',
    READ: 'room:read',
    UPDATE: 'room:update',
    DELETE: 'room:delete',
  },

  Payment: {
    CREATE: 'payment:create',
    READ: 'payment:read',
    UPDATE: 'payment:update',
    DELETE: 'payment:delete',
    PRINT_INVOICE: 'payment:print_invoice',
  },

  Doctor: {
    CREATE: 'doctor:create',
    READ: 'doctor:read',
    UPDATE: 'doctor:update',
    DELETE: 'doctor:delete',
    ASSIGN_TO_SECTION: 'doctor:assign_doctor_to_section',
    ASSIGN_TO_SECTION_AND_ROOM: 'doctor:assign_doctor_to_section_and_room',
    CHANGE_DEPARTMENT: 'doctor:change_doctor_department',
    END_ASSIGNMENT: 'doctor:end_doctor_assignment',
  },

  Patient: {
    CREATE: 'patient:create',
    READ: 'patient:read',
    UPDATE: 'patient:update',
    DELETE: 'patient:delete',
  },

  DisabledCard: {
    CREATE: 'disabledCard:create',
    READ: 'disabledCard:read',
    UPDATE: 'disabledCard:update',
    DELETE: 'disabledCard:delete',
  },

  Sale: {
    CREATE: 'sale:create',
    READ: 'sale:read',
    UPDATE: 'sale:update',
    DELETE: 'sale:delete',
    CHANGE_STATUS: 'sale:change_status',
  },

  ExitCard: {
    CREATE: 'exitCard:create',
    READ: 'exitCard:read',
    UPDATE: 'exitCard:update',
    DELETE: 'exitCard:delete',
    PRINT: 'exitCard:print',
  },

  User: {
    CREATE: 'user:create',
    READ: 'user:read',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
    GRANT_PERMISSIONS: 'user:grant_permissions',
    DENY_PERMISSIONS: 'user:deny_permissions',
    ASSIGN_ROLES: 'user:assign_roles',
    REMOVE_ROLES: 'user:remove_roles',
  },

  Role: {
    READ: 'role:read',
    ACTIVATE_PERMISSIONS: 'role:activate_permissions',
    DEACTIVATE_PERMISSIONS: 'role:deactivate_permissions',
  },

  Order: {
    CREATE: 'order:create',
    READ: 'order:read',
    UPDATE: 'order:update',
    DELETE: 'order:delete',
    CHANGE_STATUS: 'order:change_status',
    PRINT: 'order:print',
  },

  ExchangeOrder: {
    CREATE: 'exchangeOrder:create',
    READ: 'exchangeOrder:read',
    UPDATE: 'exchangeOrder:update',
    DELETE: 'exchangeOrder:delete',
    CHANGE_STATUS: 'exchangeOrder:change_status',
    PRINT: 'exchangeOrder:print',
  },

  Purchase: {
    CREATE: 'purchase:create',
    READ: 'purchase:read',
    UPDATE: 'purchase:update',
    DELETE: 'purchase:delete',
    CHANGE_STATUS: 'purchase:change_status',
  },
} as const;
