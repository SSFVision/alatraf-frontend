import { PERMISSIONS } from '../auth/Roles/permissions.map';
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
        icon: 'assets/icons/user-management-w.svg',
        activeIcon: 'assets/icons/user-management-b.svg',
        route: AppRoutes.users.root,
        requiredPermissions: [PERMISSIONS.Payment.READ],
      },
      {
        label: 'إدارةالأطباء',
        icon: 'assets/icons/doctors-management-w.svg',
        activeIcon: 'assets/icons/doctors-management-b.svg',
        route: AppRoutes.doctors.root,
        requiredPermissions: [PERMISSIONS.Doctor.CREATE],
      },
        {
        label: ' إدارة الاقسام ',
        icon: 'assets/icons/grid-fill-w.svg',
        activeIcon: 'assets/icons/grid-fill-b.svg',
        route: `${AppRoutes.sections.root}`,
        requiredPermissions: [PERMISSIONS.Section.READ],
      },
        {
        label: 'البرامج العلاجية ',
        icon: 'assets/icons/dumbbell-w.svg',
        activeIcon: 'assets/icons/dumbbell-b.svg',
        route: `${AppRoutes.medicalPrograms.root}`,
        requiredPermissions: [PERMISSIONS.MedicalProgram.READ],
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
        requiredPermissions: [PERMISSIONS.Patient.READ],
      },
      {
        label: 'إدارة الخدمات',
        icon: 'assets/icons/services-w.svg',
        activeIcon: 'assets/icons/services-b.svg',
        route: AppRoutes.services.root,
        requiredPermissions: [PERMISSIONS.Service.READ],
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
        requiredPermissions: [PERMISSIONS.TherapyCard.CREATE],
      },
      {
        label: 'إدارة الجلسات',
        icon: 'assets/icons/credit-card-w.svg',
        activeIcon: 'assets/icons/credit-card-b.svg',
        route: `${AppRoutes.therapyCards.root}`,
        requiredPermissions: [PERMISSIONS.TherapyCard.READ_SESSION],
      },
         {
        label: ' الاصابات',
        icon: 'assets/icons/services-w.svg',
        activeIcon: 'assets/icons/services-b.svg',
        route: AppRoutes.injuries.root,
        requiredPermissions: [PERMISSIONS.IndustrialPart.READ],
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
        requiredPermissions: [PERMISSIONS.RepairCard.READ],
      },
      {
        label: 'كروت اصلاح فني ',
        icon: 'assets/icons/credit-card-w.svg',
        activeIcon: 'assets/icons/credit-card-b.svg',
        route: `${AppRoutes.repairCards.root}`,
        requiredPermissions: [PERMISSIONS.RepairCard.ASSIGN_TECHNICIAN],
      },
      {
        label: 'الاطراف الصناعية ',
        icon: 'assets/icons/prosthetic-foot-w.svg',
        activeIcon: 'assets/icons/prosthetic-foot-b.svg',
        route: `${AppRoutes.industrialParts.root}`,
        requiredPermissions: [PERMISSIONS.IndustrialPart.READ],
      },

      {
        label: 'جدولة المواعيد',
        icon: 'assets/icons/appointment-w.svg',
        activeIcon: 'assets/icons/appointment-b.svg',
        route: `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.waaitngPatients}`,
        requiredPermissions: [PERMISSIONS.Appointment.READ],
      },
      {
        label: 'إدارة المواعيد',
        icon: 'assets/icons/appointment-w.svg',
        activeIcon: 'assets/icons/appointment-b.svg',
        route: `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}`,
        requiredPermissions: [PERMISSIONS.Appointment.CHANGE_STATUS],
      },
    ],
  },

  {
    category: 'قسم  الحسابات والدفع ',
    CateRoute: AppRoutes.finance.root,
    items: [
      {
        label: 'إدارة الحاسابات',
        icon: 'assets/icons/file-ruled-w.svg',
        activeIcon: 'assets/icons/file-ruled-b.svg',
        route: AppRoutes.finance.root,
        requiredPermissions: [PERMISSIONS.Payment.READ],
      },
      {
        label: 'بطائق المرضى',
        icon: 'assets/icons/card-w.svg',
        activeIcon: 'assets/icons/card-b.svg',
        route: AppRoutes.patientCards.disabled.root,
        requiredPermissions: [PERMISSIONS.DisabledCard.READ],
      },
    ],
  },
];
