import { ServiceDto } from "./service.model";

export const MOCK_SERVICES: ServiceDto[] = [
  {
    serviceId: 1,
    name: 'علاج طبيعي',
    departmentId: 4,
    department: 'العلاج الطبيعي',
    price: 30,
  },
  {
    serviceId: 2,
    name: 'اعصاب',
    departmentId: 6,
    department: 'قسم الأعصاب',
    price: 35,
  },
  {
    serviceId: 3,
    name: 'عظام',
    departmentId: 7,
    department: 'قسم العظام',
    price: 35,
  },
  {
    serviceId: 4,
    name: 'خدمة تجديد كرت علاج طبيعي',
    departmentId: 4,
    department: 'العلاج الطبيعي',
    price: 10,
  },
  {
    serviceId: 5,
    name: 'خدمة بدل فاقد',
    departmentId: 1,
    department: 'الاستقبال',
    price: 5,
  },
  {
    serviceId: 9,
    name: 'خدمة مبيعات',
    departmentId: 8,
    department: 'المبيعات',
    price: 0,
  },
];
