export type SystemType = 'all' | 'skeletal' | 'circulatory' | 'nervous' | 'digestive' | 'respiratory';
export type DiseaseType = 'none' | 'heart_attack' | 'broken_bone' | 'common_cold';

export interface BodyPartInfo {
  id: string;
  name: string;
  system: SystemType;
  description: string;
  function: string;
}

export const BODY_PARTS: Record<string, BodyPartInfo> = {
  skull: {
    id: 'skull',
    name: 'Skull',
    system: 'skeletal',
    description: 'The bony structure that forms the head in vertebrates.',
    function: 'Protects the brain and supports the structures of the face.'
  },
  spine: {
    id: 'spine',
    name: 'Spine',
    system: 'skeletal',
    description: 'A series of vertebrae extending from the skull to the small of the back.',
    function: 'Encloses and protects the spinal cord, supports the head, and serves as an attachment point for ribs and muscles.'
  },
  ribcage: {
    id: 'ribcage',
    name: 'Ribcage',
    system: 'skeletal',
    description: 'The arrangement of ribs attached to the vertebral column and sternum.',
    function: 'Protects the heart and lungs.'
  },
  femur: {
    id: 'femur',
    name: 'Femur',
    system: 'skeletal',
    description: 'The bone of the thigh or upper hind limb.',
    function: 'Supports the weight of the body and allows motion of the leg.'
  },
  humerus: {
    id: 'humerus',
    name: 'Humerus',
    system: 'skeletal',
    description: 'The bone of the upper arm or forelimb.',
    function: 'Serves as an attachment point for muscles of the shoulder and arm.'
  },
  heart: {
    id: 'heart',
    name: 'Heart',
    system: 'circulatory',
    description: 'A muscular organ in most animals, which pumps blood through the blood vessels of the circulatory system.',
    function: 'Pumps oxygenated blood to the body and deoxygenated blood to the lungs.'
  },
  brain: {
    id: 'brain',
    name: 'Brain',
    system: 'nervous',
    description: 'An organ that serves as the center of the nervous system in all vertebrate and most invertebrate animals.',
    function: 'Controls most of the activities of the body, processing, integrating, and coordinating the information it receives.'
  },
  stomach: {
    id: 'stomach',
    name: 'Stomach',
    system: 'digestive',
    description: 'A muscular, hollow organ in the gastrointestinal tract of humans and many other animals.',
    function: 'Secretes acid and enzymes that digest food.'
  },
  lungs: {
    id: 'lungs',
    name: 'Lungs',
    system: 'respiratory',
    description: 'The primary organs of the respiratory system in humans and many other animals.',
    function: 'Extract oxygen from the atmosphere and transfer it into the bloodstream, and release carbon dioxide from the bloodstream into the atmosphere.'
  }
};

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
