import { Patient, PatientType } from './patient.dto';

export const PATIENTS_MOCK_DATA: Patient[] = [
  {
    patientId: 1,
    fullname: 'وليد محمد عون الحكيمي',
    birthdate: '1990-05-10',
    phone: '0501234567',
    nationalNo: 'A1234567',
    address: 'شارع الملك فيصل 123',
    gender: true,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR101'
  },
  {
    patientId: 2,
    fullname: 'سارة علي خالد الأنصاري (سوسو)',
    birthdate: '1985-09-20',
    phone: '0507654321',
    nationalNo: 'B7654321',
    address: 'شارع الأمير عبد الله 456',
    gender: false,
    patientType: PatientType.Wounded,
    autoRegistrationNumber: 'AR102'
  },
  {
    patientId: 3,
    fullname: 'خالد حسين عبد الله الشهري (خخ)',
    birthdate: '1992-03-15',
    phone: '0501122334',
    nationalNo: 'C1122334',
    address: 'شارع النور 789',
    gender: true,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR103'
  },
  {
    patientId: 4,
    fullname: 'ليلى فهد محمود القحطاني (ليلي)',
    birthdate: '1998-07-25',
    phone: '0502233445',
    nationalNo: 'D2233445',
    address: 'شارع السلام 101',
    gender: false,
    patientType: PatientType.Wounded,
    autoRegistrationNumber: 'AR104'
  },
  {
    patientId: 5,
    fullname: 'محمد إبراهيم أحمد العلي (مو)',
    birthdate: '1980-12-05',
    phone: '0503344556',
    nationalNo: 'E3344556',
    address: 'شارع الحرية 202',
    gender: true,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR105'
  },
  {
    patientId: 6,
    fullname: 'نورة عبدالله حسن السالم (نونو)',
    birthdate: '1995-11-30',
    phone: '0504455667',
    nationalNo: 'F4455667',
    address: 'شارع الوحدة 303',
    gender: false,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR106'
  },
  {
    patientId: 7,
    fullname: 'يوسف علي سامي الغامدي (يوسفي)',
    birthdate: '1988-06-18',
    phone: '0505566778',
    nationalNo: 'G5566778',
    address: 'شارع الورد 404',
    gender: true,
    patientType: PatientType.Wounded,
    autoRegistrationNumber: 'AR107'
  },
  {
    patientId: 8,
    fullname: 'هدى سامي فهد القحطاني (هدهد)',
    birthdate: '1993-02-22',
    phone: '0506677889',
    nationalNo: 'H6677889',
    address: 'شارع الخليج 505',
    gender: false,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR108'
  },
  {
    patientId: 9,
    fullname: 'عمر خالد عبد الرحمن الشهري (عمو)',
    birthdate: '1979-08-09',
    phone: '0507788990',
    nationalNo: 'I7788990',
    address: 'شارع المدينة 606',
    gender: true,
    patientType: PatientType.Wounded,
    autoRegistrationNumber: 'AR109'
  },
  {
    patientId: 10,
    fullname: 'فاطمة حسين محمد الزهراني ',
    birthdate: '1991-04-12',
    phone: '0508899001',
    nationalNo: 'J8899001',
    address: 'شارع النجمة 707',
    gender: false,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR110'
  },
  {
    patientId: 11,
    fullname: 'أحمد صالح عبدالكريم المنيع (أحمو)',
    birthdate: '1987-01-17',
    phone: '0509911223',
    nationalNo: 'K9911223',
    address: 'شارع الفجر 808',
    gender: true,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR111'
  },
  {
    patientId: 12,
    fullname: 'ريم ماجد عبدالله السبيعي (ريومة)',
    birthdate: '1994-09-03',
    phone: '0508822114',
    nationalNo: 'L8822114',
    address: 'شارع التعاون 909',
    gender: false,
    patientType: PatientType.Wounded,
    autoRegistrationNumber: 'AR112'
  },
  {
    patientId: 13,
    fullname: 'زياد محمد ناصر العتيبي (زد)',
    birthdate: '1990-06-22',
    phone: '0507733445',
    nationalNo: 'M7733445',
    address: 'شارع التحرير 1001',
    gender: true,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR113'
  },
  {
    patientId: 14,
    fullname: 'جنى فؤاد عادل المطيري (جوجو)',
    birthdate: '1999-03-18',
    phone: '0506644552',
    nationalNo: 'N6644552',
    address: 'شارع الزهور 1102',
    gender: false,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR114'
  },
  {
    patientId: 15,
    fullname: 'رائد عبدالله فهد الشهراني (رود)',
    birthdate: '1983-11-29',
    phone: '0505552213',
    nationalNo: 'O5552213',
    address: 'شارع السكينة 1203',
    gender: true,
    patientType: PatientType.Wounded,
    autoRegistrationNumber: 'AR115'
  },
  {
    patientId: 16,
    fullname: 'جواهر سالم محمد البقمي (جوجو)',
    birthdate: '1996-07-08',
    phone: '0504466332',
    nationalNo: 'P4466332',
    address: 'شارع الأمل 1304',
    gender: false,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR116'
  },
  {
    patientId: 17,
    fullname: 'فارس عارف حسن القاضي (فروسي)',
    birthdate: '1989-12-14',
    phone: '0503377441',
    nationalNo: 'Q3377441',
    address: 'شارع الغروب 1405',
    gender: true,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR117'
  },
  {
    patientId: 18,
    fullname: 'شذى خالد إبراهيم السحيباني (شذوذ)',
    birthdate: '1997-02-11',
    phone: '0502288556',
    nationalNo: 'R2288556',
    address: 'شارع اللؤلؤ 1506',
    gender: false,
    patientType: PatientType.Wounded,
    autoRegistrationNumber: 'AR118'
  },
  {
    patientId: 19,
    fullname: 'عادل ناصر محمد الحارثي (عدولي)',
    birthdate: '1981-10-05',
    phone: '0501199664',
    nationalNo: 'S1199664',
    address: 'شارع الوطن 1607',
    gender: true,
    patientType: PatientType.Wounded,
    autoRegistrationNumber: 'AR119'
  },
  {
    patientId: 20,
    fullname: 'أريج صالح عبدالله السديري (ريجو)',
    birthdate: '1994-08-27',
    phone: '0500099775',
    nationalNo: 'T0099775',
    address: 'شارع النسيم 1708',
    gender: false,
    patientType: PatientType.Normal,
    autoRegistrationNumber: 'AR120'
  }
];
