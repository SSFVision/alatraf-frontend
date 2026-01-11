import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { UserDetailsDto } from '../../../../core/auth/models/user-details.dto.';
import { PERMISSIONS } from '../../../../core/auth/Roles/permissions.map';

type ExtraPermission = {
  label: string;
  perm: string;
};

type PermissionGroup = {
  label: string;
  read?: string;
  create?: string;
  update?: string;
  delete?: string;
  changeStatus?: string;
  print?: string;
  extras?: ExtraPermission[];
};
@Component({
  selector: 'app-user-permissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css'],
})
export class UserPermissionsComponent {
  user = input<UserDetailsDto | null>(null);

  roles = computed(() => this.user()?.roles ?? []);
  permissions = computed(() => this.user()?.permissions ?? []);
  permissionsSet = computed(() => new Set(this.permissions()));

  isPermGranted(perm?: string): boolean {
    if (!perm) return false;
    return this.permissionsSet().has(perm);
  }

  trackByName(index: number, value: string) {
    return value ?? index;
  }

  // Map UI rows to defined CRUD permission codes (READ/CREATE/UPDATE/DELETE)
  // For domains without full CRUD, missing ones are left undefined

  permissionGroups: PermissionGroup[] = [
    {
      label: 'الأشخاص',
      read: PERMISSIONS.Person.READ,
      create: PERMISSIONS.Person.CREATE,
      update: PERMISSIONS.Person.UPDATE,
      delete: PERMISSIONS.Person.DELETE,
    },
    {
      label: 'الخدمات',
      read: PERMISSIONS.Service.READ,
      create: PERMISSIONS.Service.CREATE,
      update: PERMISSIONS.Service.UPDATE,
      delete: PERMISSIONS.Service.DELETE,
    },
    {
      label: 'التذاكر',
      read: PERMISSIONS.Ticket.READ,
      create: PERMISSIONS.Ticket.CREATE,
      update: PERMISSIONS.Ticket.UPDATE,
      delete: PERMISSIONS.Ticket.DELETE,
      print: PERMISSIONS.Ticket.PRINT,
    },
    {
      label: 'المواعيد',
      read: PERMISSIONS.Appointment.READ,
      create: PERMISSIONS.Appointment.CREATE,
      update: PERMISSIONS.Appointment.UPDATE,
      delete: PERMISSIONS.Appointment.DELETE,
      changeStatus: PERMISSIONS.Appointment.CHANGE_STATUS,
      print: PERMISSIONS.Appointment.PRINT,
      extras: [
        { label: 'إعادة جدولة', perm: PERMISSIONS.Appointment.RESCHEDULE },
      ],
    },
    {
      label: 'العطل',
      read: PERMISSIONS.Holiday.READ,
      create: PERMISSIONS.Holiday.CREATE,
      update: PERMISSIONS.Holiday.UPDATE,
      delete: PERMISSIONS.Holiday.DELETE,
    },
    {
      label: 'بطاقات العلاج',
      read: PERMISSIONS.TherapyCard.READ,
      create: PERMISSIONS.TherapyCard.CREATE,
      update: PERMISSIONS.TherapyCard.UPDATE,
      delete: PERMISSIONS.TherapyCard.DELETE,
      print: PERMISSIONS.TherapyCard.PRINT_CARD,
      extras: [
        { label: 'تجديد', perm: PERMISSIONS.TherapyCard.RENEW },
        { label: 'بدل تالف', perm: PERMISSIONS.TherapyCard.DAMAGE_REPLACEMENT },
        { label: 'إنشاء جلسة', perm: PERMISSIONS.TherapyCard.CREATE_SESSION },
        { label: 'عرض الجلسات', perm: PERMISSIONS.TherapyCard.READ_SESSION },
        { label: 'طباعة جلسة', perm: PERMISSIONS.TherapyCard.PRINT_SESSION },
      ],
    },
    {
      label: 'بطاقات الصيانة',
      read: PERMISSIONS.RepairCard.READ,
      create: PERMISSIONS.RepairCard.CREATE,
      update: PERMISSIONS.RepairCard.UPDATE,
      delete: PERMISSIONS.RepairCard.DELETE,
      changeStatus: PERMISSIONS.RepairCard.CHANGE_STATUS,
      print: PERMISSIONS.RepairCard.PRINT_CARD,
      extras: [
        { label: 'تعيين فني', perm: PERMISSIONS.RepairCard.ASSIGN_TECHNICIAN },
        {
          label: 'إنشاء وقت تسليم',
          perm: PERMISSIONS.RepairCard.CREATE_DELIVERY_TIME,
        },
        {
          label: 'طباعة وقت تسليم',
          perm: PERMISSIONS.RepairCard.PRINT_DELIVERY_TIME,
        },
      ],
    },
    {
      label: 'الأطراف الصناعية',
      read: PERMISSIONS.IndustrialPart.READ,
      create: PERMISSIONS.IndustrialPart.CREATE,
      update: PERMISSIONS.IndustrialPart.UPDATE,
      delete: PERMISSIONS.IndustrialPart.DELETE,
    },
    {
      label: 'البرامج الطبية',
      read: PERMISSIONS.MedicalProgram.READ,
      create: PERMISSIONS.MedicalProgram.CREATE,
      update: PERMISSIONS.MedicalProgram.UPDATE,
      delete: PERMISSIONS.MedicalProgram.DELETE,
    },
    {
      label: 'الإدارات',
      read: PERMISSIONS.Department.READ,
      create: PERMISSIONS.Department.CREATE,
      update: PERMISSIONS.Department.UPDATE,
      delete: PERMISSIONS.Department.DELETE,
    },
    {
      label: 'الأقسام',
      read: PERMISSIONS.Section.READ,
      create: PERMISSIONS.Section.CREATE,
      update: PERMISSIONS.Section.UPDATE,
      delete: PERMISSIONS.Section.DELETE,
    },
    {
      label: 'الغرف',
      read: PERMISSIONS.Room.READ,
      create: PERMISSIONS.Room.CREATE,
      update: PERMISSIONS.Room.UPDATE,
      delete: PERMISSIONS.Room.DELETE,
    },
    {
      label: 'الحسابات',
      read: PERMISSIONS.Payment.READ,
      create: PERMISSIONS.Payment.CREATE,
      update: PERMISSIONS.Payment.UPDATE,
      delete: PERMISSIONS.Payment.DELETE,
      print: PERMISSIONS.Payment.PRINT_INVOICE,
    },
    {
      label: 'الأطباء',
      read: PERMISSIONS.Doctor.READ,
      create: PERMISSIONS.Doctor.CREATE,
      update: PERMISSIONS.Doctor.UPDATE,
      delete: PERMISSIONS.Doctor.DELETE,
      extras: [
        { label: 'تعيين لقسم', perm: PERMISSIONS.Doctor.ASSIGN_TO_SECTION },
        {
          label: 'تعيين لقسم وغرفة',
          perm: PERMISSIONS.Doctor.ASSIGN_TO_SECTION_AND_ROOM,
        },
        { label: 'تغيير الإدارة', perm: PERMISSIONS.Doctor.CHANGE_DEPARTMENT },
        { label: 'إنهاء التعيين', perm: PERMISSIONS.Doctor.END_ASSIGNMENT },
      ],
    },
    {
      label: 'المرضى',
      read: PERMISSIONS.Patient.READ,
      create: PERMISSIONS.Patient.CREATE,
      update: PERMISSIONS.Patient.UPDATE,
      delete: PERMISSIONS.Patient.DELETE,
    },
    {
      label: 'بطاقات المعاق',
      read: PERMISSIONS.DisabledCard.READ,
      create: PERMISSIONS.DisabledCard.CREATE,
      update: PERMISSIONS.DisabledCard.UPDATE,
      delete: PERMISSIONS.DisabledCard.DELETE,
    },
    {
      label: 'المبيعات',
      read: PERMISSIONS.Sale.READ,
      create: PERMISSIONS.Sale.CREATE,
      update: PERMISSIONS.Sale.UPDATE,
      delete: PERMISSIONS.Sale.DELETE,
      changeStatus: PERMISSIONS.Sale.CHANGE_STATUS,
    },
    {
      label: 'بطاقات الخروج',
      read: PERMISSIONS.ExitCard.READ,
      create: PERMISSIONS.ExitCard.CREATE,
      update: PERMISSIONS.ExitCard.UPDATE,
      delete: PERMISSIONS.ExitCard.DELETE,
      print: PERMISSIONS.ExitCard.PRINT,
    },
    {
      label: 'المستخدمون',
      read: PERMISSIONS.User.READ,
      create: PERMISSIONS.User.CREATE,
      update: PERMISSIONS.User.UPDATE,
      delete: PERMISSIONS.User.DELETE,
      extras: [
        { label: 'منح صلاحيات', perm: PERMISSIONS.User.GRANT_PERMISSIONS },
        { label: 'سحب صلاحيات', perm: PERMISSIONS.User.DENY_PERMISSIONS },
        { label: 'تعيين أدوار', perm: PERMISSIONS.User.ASSIGN_ROLES },
        { label: 'إزالة أدوار', perm: PERMISSIONS.User.REMOVE_ROLES },
      ],
    },
    {
      label: 'الأدوار',
      read: PERMISSIONS.Role.READ,
      extras: [
        { label: 'تفعيل صلاحيات', perm: PERMISSIONS.Role.ACTIVATE_PERMISSIONS },
        {
          label: 'تعطيل صلاحيات',
          perm: PERMISSIONS.Role.DEACTIVATE_PERMISSIONS,
        },
      ],
    },
    {
      label: 'الطلبات',
      read: PERMISSIONS.Order.READ,
      create: PERMISSIONS.Order.CREATE,
      update: PERMISSIONS.Order.UPDATE,
      delete: PERMISSIONS.Order.DELETE,
      changeStatus: PERMISSIONS.Order.CHANGE_STATUS,
      print: PERMISSIONS.Order.PRINT,
    },
    {
      label: 'طلبات التبادل',
      read: PERMISSIONS.ExchangeOrder.READ,
      create: PERMISSIONS.ExchangeOrder.CREATE,
      update: PERMISSIONS.ExchangeOrder.UPDATE,
      delete: PERMISSIONS.ExchangeOrder.DELETE,
      changeStatus: PERMISSIONS.ExchangeOrder.CHANGE_STATUS,
      print: PERMISSIONS.ExchangeOrder.PRINT,
    },
    {
      label: 'المشتريات',
      read: PERMISSIONS.Purchase.READ,
      create: PERMISSIONS.Purchase.CREATE,
      update: PERMISSIONS.Purchase.UPDATE,
      delete: PERMISSIONS.Purchase.DELETE,
      changeStatus: PERMISSIONS.Purchase.CHANGE_STATUS,
    },
  ];

  extraColumns = Array.from(
    new Set(
      this.permissionGroups.flatMap(
        (group) => group.extras?.map((extra) => extra.label) ?? []
      )
    )
  );

  trackByLabel(index: number, group: PermissionGroup) {
    return group.label ?? index;
  }

  trackByExtraHeader(index: number, label: string) {
    return label ?? index;
  }

  getExtraPerm(group: PermissionGroup, label: string): string | undefined {
    return group.extras?.find((extra) => extra.label === label)?.perm;
  }
}
