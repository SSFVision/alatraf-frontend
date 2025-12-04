import { ServiceDto } from "./service.model";

export const MOCK_SERVICES: ServiceDto[] = [
  {
    serviceId: 1,
    name: 'علاج طبيعي',
    departmentId: 4,
    department: 'العلاج الطبيعي',
    price: 0,
  },
  {
    serviceId: 2,
    name: 'اعصاب',
    departmentId: 6,
    department: 'قسم الأعصاب',
    price: 0,
  },
  {
    serviceId: 3,
    name: 'عظام',
    departmentId: 7,
    department: 'قسم العظام',
    price: 0,
  },
  {
    serviceId: 4,
    name: 'خدمة تجديد كرت علاج طبيعي',
    departmentId: 4,
    department: 'العلاج الطبيعي',
    price: 0,
  },
  {
    serviceId: 5,
    name: 'خدمة بدل فاقد',
    departmentId: 1,
    department: 'الاستقبال',
    price: 500,
  },
  {
    serviceId: 9,
    name: 'خدمة مبيعات',
    departmentId: 8,
    department: 'المبيعات',
    price:null,
  },
  {
    serviceId: 10,
    name: 'أطراف صناعية',
    departmentId: 9,
    department: 'قسم الأطراف الصناعية',
    price: null,
  }
];
