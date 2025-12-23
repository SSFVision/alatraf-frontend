import { AccountKind } from '../Models/account-kind.enum';

export const ACCOUNT_KIND_LABELS: Record<AccountKind, string> = {
  [AccountKind.Free]: 'مجاني',
  [AccountKind.Patient]: 'نقدي',
  [AccountKind.Disabled]: 'صندوق المعاقين',
  [AccountKind.Wounded]: 'صندوق الجرحى',
};
