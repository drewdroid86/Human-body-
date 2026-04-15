export type SystemType = 'all' | 'skeletal' | 'circulatory' | 'nervous' | 'digestive' | 'respiratory';
export type DiseaseType = 'none' | 'heart_attack' | 'broken_bone' | 'common_cold';

export const DISEASES = {
  heart_attack: {
    id: 'heart_attack',
    name: 'Heart Attack (Myocardial Infarction)',
    description: 'Occurs when blood flow decreases or stops to a part of the heart, causing damage to the heart muscle.',
    affectedParts: ['heart']
  },
  broken_bone: {
    id: 'broken_bone',
    name: 'Broken Bone (Fracture)',
    description: 'A medical condition in which there is a partial or complete break in the continuity of the bone. In this example, the femur is affected.',
    affectedParts: ['femur']
  },
  common_cold: {
    id: 'common_cold',
    name: 'Common Cold',
    description: 'A viral infectious disease of the upper respiratory tract that primarily affects the respiratory mucosa of the nose, throat, sinuses, and larynx.',
    affectedParts: ['lungs']
  }
};
