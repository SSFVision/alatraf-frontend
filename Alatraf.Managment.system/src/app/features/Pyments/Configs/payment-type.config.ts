import { AccountKind } from '../Models/account-kind.enum';

export interface PaymentTypeConfig {
  accountKind: AccountKind;

  /** UI behavior */
  showPaidAmount: boolean;
  showDiscount: boolean;
  showVoucherNumber: boolean;
  showDisabledCardId: boolean;
  showReportNumber: boolean;
  showNotes: boolean;
  showNetAmount: boolean;

  /** Validation */
  requiredFields: Array<
    'paidAmount' | 'voucherNumber' | 'disabledCardId' | 'reportNumber'
  >;
}

export const PAYMENT_TYPE_CONFIG: Record<AccountKind, PaymentTypeConfig> = {
  [AccountKind.Free]: {
    accountKind: AccountKind.Free,

    showPaidAmount: false,
    showDiscount: false,
    showVoucherNumber: false,
    showDisabledCardId: false,
    showReportNumber: false,
    showNotes: false,
    showNetAmount: false,

    requiredFields: [],
  },

  [AccountKind.Patient]: {
    accountKind: AccountKind.Patient,
    showNetAmount: true,

    showPaidAmount: true,
    showDiscount: true,
    showVoucherNumber: true,
    showDisabledCardId: false,
    showReportNumber: false,
    showNotes: true,

    requiredFields: ['paidAmount', 'voucherNumber'],
  },

  [AccountKind.Disabled]: {
    accountKind: AccountKind.Disabled,

    showPaidAmount: false,
    showDiscount: false,
    showVoucherNumber: false,
    showDisabledCardId: true,
    showReportNumber: false,
    showNotes: true,
    showNetAmount: false,

    requiredFields: ['disabledCardId'],
  },

  [AccountKind.Wounded]: {
    accountKind: AccountKind.Wounded,

    showPaidAmount: false,
    showDiscount: false,
    showVoucherNumber: false,
    showDisabledCardId: false,
    showReportNumber: true,
    showNotes: true,
    showNetAmount: false,

    requiredFields: [],
  },
};
