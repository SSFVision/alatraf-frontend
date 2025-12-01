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
    permissions: ['view_patient', 'add_patient', 'add_ticket'],
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
      'add_patient',
      'add_ticket',
    ],
  },
  {
    userId: 3,
    userName: 'wa',
    password: 'wa',
    roles: ['Reception'],
    permissions: [
      'view_patient',
      'add_patient',
      'delete_patient',
      'update_patient',
      'view_diagnosis',
      'add_ticket',
    ],
  },
];
