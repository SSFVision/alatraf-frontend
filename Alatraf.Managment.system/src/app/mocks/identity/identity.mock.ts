import { AppUserRole } from '../../core/auth/models/app.user.roles.enum';
import { PERMISSIONS } from '../../core/auth/models/permissions.map';
import { IdentityUserMock } from './identity.dto';

// ----------------------------------------
// MOCK USERS FOR IDENTITY SERVICE
// ----------------------------------------
export const IDENTITY_USERS_MOCK: IdentityUserMock[] = [
  {
    userId: 1,
    userName: 're',
    password: 're',
    roles: ['Reception'],
    permissions: [PERMISSIONS.PATIENTS.VIEW, PERMISSIONS.PATIENTS.ADD],
  },
  {
    userId: 2,
    userName: 'dd',
    password: 'dd',
    roles: ['Doctor_Therapy'],
    permissions: [PERMISSIONS.DIAGNOSIS.THERAPY.VIEW],
  },
  {
    userId: 3,
    userName: 'ff',
    password: 'fc',
    roles: ['Doctor_Industrial'],
    permissions: [
      PERMISSIONS.DIAGNOSIS.INDUSTRIAL.VIEW,
      PERMISSIONS.DIAGNOSIS.THERAPY.VIEW,
      PERMISSIONS.PATIENTS.ADD,
      PERMISSIONS.TICKETS.ADD,
    ],
  },
  {
    userId: 4,
    userName: 'wa',
    password: 'fc',
    roles: [AppUserRole.Doctor_Therapy],
    permissions: [
      PERMISSIONS.PATIENTS.VIEW,
      PERMISSIONS.PATIENTS.ADD,
      PERMISSIONS.PATIENTS.UPDATE,
      PERMISSIONS.PATIENTS.DELETE,
      PERMISSIONS.DIAGNOSIS.THERAPY.VIEW,
      PERMISSIONS.DIAGNOSIS.INDUSTRIAL.VIEW,
      PERMISSIONS.TICKETS.ADD,
      PERMISSIONS.PAYMENTS.VIEW,
      PERMISSIONS.PAYMENTS.ADD,
    ],
  },
  {
    userId: 5,
    userName: 'fc',
    password: 'fc',
    roles: [AppUserRole.Finance],
    permissions: [
      PERMISSIONS.PAYMENTS.VIEW,
      PERMISSIONS.PAYMENTS.ADD,
      PERMISSIONS.PATIENTS.ADD,
      PERMISSIONS.Appointment.VIEW,
      PERMISSIONS.Appointment.Schedule,
      PERMISSIONS.Appointment.ReSchedule,
    ],
  },

  {
    userId: 6,
    userName: 'ad',
    password: 'fc',
    roles: [AppUserRole.Appointment],
    permissions: [

      PERMISSIONS.Appointment.VIEW,
      PERMISSIONS.Appointment.Schedule,
      PERMISSIONS.Appointment.ReSchedule,
      PERMISSIONS.Appointment.AddHoliday,
    ],
  },
];
