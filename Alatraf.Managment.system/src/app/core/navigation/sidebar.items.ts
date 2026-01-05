import { PERMISSIONS } from '../auth/models/permissions.map';
import { AppRoutes } from '../routing/app.routes.map';

export interface MenuItem {
  label: string; // Name of the menu item
  icon?: string; // Default icon
  activeIcon?: string; // Icon when the menu item is active
  route: string; // Angular route path
  requiredPermissions: string[]; // Permissions needed to see/access this item
}

export interface MenuCategory {
  category: string; // Category name
  CateRoute?: string; // Optional icon
  items: MenuItem[]; // Array of items in this category
}
export const MENU_CONFIG: MenuCategory[] = [
  {
    category: '  إدارة النظام ',
    CateRoute: AppRoutes.finance.root,
    items: [
      {
        label: ' المستخدمين',
        icon: 'assets/icons/user-icon-w.svg',
        activeIcon: 'assets/icons/user-icon-b.svg',
        route: AppRoutes.users.root,
        requiredPermissions: [PERMISSIONS.PAYMENTS.VIEW],
      },
      {
        label: 'إدارةالدكاترة',
        icon: 'assets/icons/user-icon-w.svg',
        activeIcon: 'assets/icons/user-icon-b.svg',
        route: AppRoutes.doctors.root,
        requiredPermissions: [PERMISSIONS.PATIENTS.ADD],
      },
      
      
    ],
  },

  {
    category: 'الاستقبال',
    CateRoute: AppRoutes.reception.root,
    items: [
      {
        label: 'إدارة المرضى',
        icon: 'assets/icons/user-icon-w.svg',
        activeIcon: 'assets/icons/user-icon-b.svg',
        route: AppRoutes.reception.patients.root,
        requiredPermissions: [PERMISSIONS.PATIENTS.VIEW],
      },
      {
        label: 'إدارة الخدمات',
        icon: 'assets/icons/user-icon-w.svg',
        activeIcon: 'assets/icons/user-icon-b.svg',
        route: AppRoutes.services.root,
        requiredPermissions: [PERMISSIONS.PATIENTS.ADD],
      },
    ],
  },
  {
    category: 'قسم العلاج الطبيعي',
    CateRoute: AppRoutes.diagnosis.root,
    items: [
      {
        label: 'إدارة التشخيصات',
        icon: 'assets/icons/dumbbell-w.svg',
        activeIcon: 'assets/icons/dumbbell-b.svg',
        route: `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.therapy.root}`,
        requiredPermissions: [PERMISSIONS.DIAGNOSIS.THERAPY.VIEW],
      },
      {
        label: 'إدارة الجلسات',
        icon: 'assets/icons/dumbbell-w.svg',
        activeIcon: 'assets/icons/dumbbell-b.svg',
        route: `${AppRoutes.therapyCards.root}`,
        requiredPermissions: [PERMISSIONS.THERAPY_CARDS.VIEW],
      },
      {
        label: 'البرامج العلاجية ',
        icon: 'assets/icons/dumbbell-w.svg',
        activeIcon: 'assets/icons/dumbbell-b.svg',
        route: `${AppRoutes.medicalPrograms.root}`,
        requiredPermissions: [PERMISSIONS.MedicalPrograms.VIEW],
      },
      {
        label: ' إدارة الاقسام ',
        icon: 'assets/icons/dumbbell-w.svg',
        activeIcon: 'assets/icons/dumbbell-b.svg',
        route: `${AppRoutes.sections.root}`,
        requiredPermissions: [PERMISSIONS.MedicalPrograms.VIEW],
      },
    ],
  },

  {
    category: 'قسم الأطراف الصناعية ',
    CateRoute: AppRoutes.diagnosis.root,
    items: [
      {
        label: 'إدارة التشخيصات',
        icon: 'assets/icons/prosthetic-foot-w.svg',
        activeIcon: 'assets/icons/prosthetic-foot-b.svg',
        route: `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.industrial.root}`,
        requiredPermissions: [PERMISSIONS.DIAGNOSIS.INDUSTRIAL.VIEW],
      },
      {
        label: 'كروت الاصلاح الفني ',
        icon: 'assets/icons/prosthetic-foot-w.svg',
        activeIcon: 'assets/icons/prosthetic-foot-b.svg',
        route: `${AppRoutes.repairCards.root}`,
        requiredPermissions: [PERMISSIONS.THERAPY_CARDS.VIEW],
      },
      {
        label: 'الاطراف الصناعية ',
        icon: 'assets/icons/prosthetic-foot-w.svg',
        activeIcon: 'assets/icons/prosthetic-foot-b.svg',
        route: `${AppRoutes.industrialParts.root}`,
        requiredPermissions: [PERMISSIONS.IndustrialParts.VIEW],
      },

      {
        label: 'جدولة المواعيد',
        icon: 'assets/icons/prosthetic-foot-w.svg',
        activeIcon: 'assets/icons/prosthetic-foot-b.svg',
        route: `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.waaitngPatients}`,
        requiredPermissions: [PERMISSIONS.Appointment.VIEW],
      },
       {
        label: 'إدارة المواعيد',
        icon: 'assets/icons/prosthetic-foot-w.svg',
        activeIcon: 'assets/icons/prosthetic-foot-b.svg',
        route: `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}`,
        requiredPermissions: [PERMISSIONS.Appointment.VIEW],
      },
    ],
  },

  {
    category: 'قسم  الحسابات والدفع ',
    CateRoute: AppRoutes.finance.root,
    items: [
      {
        label: 'إدارة الحاسابات',
        icon: 'assets/icons/prosthetic-foot-w.svg',
        activeIcon: 'assets/icons/prosthetic-foot-b.svg',
        route: AppRoutes.finance.root,
        requiredPermissions: [PERMISSIONS.PAYMENTS.VIEW],
      },
      {
        label: 'بطائق المرضى',
        icon: 'assets/icons/user-icon-w.svg',
        activeIcon: 'assets/icons/user-icon-b.svg',
        route: AppRoutes.patientCards.disabled.root,
        requiredPermissions: [PERMISSIONS.PATIENTS.ADD],
      },
    ],
  },
];
