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
    userId: 4,
    userName: 'dd',
    password: 'dd',
    roles: ['Doctor_Therapy'],
    permissions: [PERMISSIONS.DIAGNOSIS.THERAPY.VIEW],
  },
  {
    userId: 2,
    userName: 'ff',
    password: 'ff',
    roles: ['Doctor_Industrial'],
    permissions: [
      PERMISSIONS.DIAGNOSIS.INDUSTRIAL.VIEW,
      PERMISSIONS.DIAGNOSIS.THERAPY.VIEW,
      PERMISSIONS.PATIENTS.ADD,
      PERMISSIONS.TICKETS.ADD,
    ],
  },
  {
    userId: 3,
    userName: 'wa',
    password: 'wa',
    roles: ['Doctor_Industrial'],
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
];
