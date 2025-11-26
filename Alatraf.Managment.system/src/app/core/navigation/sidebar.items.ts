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

// export const MENU_CONFIG: MenuCategory[] = [
//   {
//     category: 'الاستقبال',
//     CateRoute: AppRoutes.reception.root,
//     items: [
//       {
//         label: 'إدارة المرضى',
//         icon: 'assets/icons/user-icon-w.svg',
//         activeIcon: 'assets/icons/user-icon-b.svg',
//         route: AppRoutes.reception.patients.root,
//         requiredPermissions: [PERMISSIONS.PATIENTS.ADD],
//       },
//       {
//         label: 'إضافة مريض',
//         icon: 'assets/icons/user-icon-w.svg',
//         activeIcon: 'assets/icons/user-icon-b.svg',
//         route: AppRoutes.reception.patients.add,
//         requiredPermissions: [PERMISSIONS.PATIENTS.VIEW],
//       },
//     ],
//   },
// ];
export const MENU_CONFIG: MenuCategory[] = [
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
        label: 'إضافة مريض',
        icon: 'assets/icons/user-icon-w.svg',
        activeIcon: 'assets/icons/user-icon-b.svg',
        route: AppRoutes.reception.patients.add,
        requiredPermissions: [PERMISSIONS.PATIENTS.ADD],
      },

      {
        label: 'تعديل مريض',
        icon: 'assets/icons/user-icon-w.svg',
        activeIcon: 'assets/icons/user-icon-b.svg',
        route: AppRoutes.reception.patients.edit(1),
        requiredPermissions: [PERMISSIONS.PATIENTS.UPDATE],
      },
      {
        label: 'حذف مريض',
        icon: 'assets/icons/user-icon-w.svg',
        activeIcon: 'assets/icons/user-icon-b.svg',
        route: AppRoutes.reception.patients.edit(3),
        requiredPermissions: [PERMISSIONS.PATIENTS.DELETE],
      },
    ],
  },
  {
    category: 'التشخيصات',
    CateRoute: AppRoutes.doctor.root,
    items: [
      {
        label: 'إدارة التشخيصات',
        icon: 'assets/icons/user-icon-w.svg',
        activeIcon: 'assets/icons/user-icon-b.svg',
        route: AppRoutes.doctor.diagnosis.root,
        requiredPermissions: [PERMISSIONS.DIAGNOSIS.VIEW],
      },
    ],
  },
];
