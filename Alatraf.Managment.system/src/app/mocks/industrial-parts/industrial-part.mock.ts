import { MockIndustrialPartDto } from './industrial-part.model';

export const INDUSTRIAL_PARTS_MOCK: MockIndustrialPartDto[] = [
  {
    industrialPartId: 1,
    name: 'Knee Brace',
    description: 'Support brace for knee injuries',
    units: [
      { industrialPartUnitId: 101, unitId: 1, unitName: 'Small',  pricePerUnit: 150 },
      { industrialPartUnitId: 102, unitId: 2, unitName: 'Medium', pricePerUnit: 160 },
      { industrialPartUnitId: 103, unitId: 3, unitName: 'Large',  pricePerUnit: 175 },
    ],
  },
  {
    industrialPartId: 2,
    name: 'Shoulder Support',
    description: 'Adjustable support for shoulder stabilization',
    units: [
      { industrialPartUnitId: 201, unitId: 4, unitName: 'Standard', pricePerUnit: 200 },
      { industrialPartUnitId: 202, unitId: 5, unitName: 'Pro',      pricePerUnit: 240 },
    ],
  },
  {
    industrialPartId: 3,
    name: 'Ankle Orthotic',
    description: 'Orthotic support for ankle rehabilitation',
    units: [
      { industrialPartUnitId: 301, unitId: 6, unitName: 'Universal', pricePerUnit: 120 }
    ],
  }
];
