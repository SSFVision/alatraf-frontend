export enum AppUserRole {
  Admin = 'Admin',
  Receptionist = 'Receptionist',
  FinanceEmployee = 'FinanceEmployee',
  TherapyDoctor = 'TherapyDoctor',
  IndustrialDoctor = 'IndustrialDoctor',
  TechnicalManagementReceptionist = 'TechnicalManagementReceptionist',
  TherapyManagementReceptionist = 'TherapyManagementReceptionist',
  OrdersEmployee = 'OrdersEmployee',
  ExchangeOrderEmployee = 'ExchangeOrderEmployee',
  SalesEmployee = 'SalesEmployee',
  PurchaseEmployee = 'PurchaseEmployee',
  AppointmentsEmployee = 'AppointmentsEmployee',
  ExitsEmployee = 'ExitsEmployee',
}
export const RoleArabicMap: Record<AppUserRole, string> = {
  [AppUserRole.Admin]: 'مدير',
  [AppUserRole.Receptionist]: 'موظف استقبال',
  [AppUserRole.FinanceEmployee]: 'موظف مالي',
  [AppUserRole.TherapyDoctor]: 'طبيب علاج طبيعي',
  [AppUserRole.IndustrialDoctor]: 'طبيب  اطراف صناعية',
  [AppUserRole.TechnicalManagementReceptionist]: 'استقبال الإدارة الفنية',
  [AppUserRole.TherapyManagementReceptionist]: 'استقبال إدارة العلاج',
  [AppUserRole.OrdersEmployee]: 'موظف طلبات',
  [AppUserRole.ExchangeOrderEmployee]: 'موظف تبادل الطلبات',
  [AppUserRole.SalesEmployee]: 'موظف مبيعات',
  [AppUserRole.PurchaseEmployee]: 'موظف مشتريات',
  [AppUserRole.AppointmentsEmployee]: 'موظف مواعيد',
  [AppUserRole.ExitsEmployee]: 'موظف خروج',
};
export function mapRoleToArabic(role: string): string {
  // Check if role exists in AppUserRole
  if (Object.values(AppUserRole).includes(role as AppUserRole)) {
    return RoleArabicMap[role as AppUserRole];
  }
  return role; // fallback: return original string if not mapped
}
