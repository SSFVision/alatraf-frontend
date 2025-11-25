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
    userId: 2,
    userName: 'doctor',
    password: '123',
    roles: ['Doctor'],
    permissions: ['view_patient'],
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
      'view_dashboard',
    ],
  },
];
