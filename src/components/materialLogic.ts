import * as THREE from 'three';
import { DISEASES } from '../models/anatomy';
import type { SystemType, DiseaseType } from '../models/anatomy';

// Performance optimization: cache colors and reuse instances
const COLOR_CACHE: Record<string, THREE.Color> = {};
const COLOR_BLACK = new THREE.Color(0x000000);
const COLOR_WHITE = new THREE.Color(0xffffff);
const COLOR_HOVER = new THREE.Color(0x222222);
const COLOR_SELECT = new THREE.Color(0x333333);
const COLOR_GHOST = new THREE.Color(0x444444);

// Disease specific colors
const COLOR_HEART_ATTACK = new THREE.Color(0x330000);
const COLOR_HEART_ATTACK_EMISSIVE = new THREE.Color(0x110000);
const COLOR_BROKEN_BONE = new THREE.Color(0xffcccc);
const COLOR_BROKEN_BONE_EMISSIVE = new THREE.Color(0x330000);
const COLOR_COMMON_COLD = new THREE.Color(0x66aa66);
const COLOR_COMMON_COLD_EMISSIVE = new THREE.Color(0x001100);

const RESULT_CACHE = new Map<string, MaterialResult>();

export interface MaterialResult {
  color: THREE.Color;
  emissive: THREE.Color;
  opacity: number;
  transparent: boolean;
  roughness: number;
  metalness: number;
  transmission: number;
  thickness: number;
  envMapIntensity: number;
  clearcoat: number;
  clearcoatRoughness: number;
}

interface MaterialState {
  color: THREE.Color;
  emissive: THREE.Color;
  opacity: number;
  transparent: boolean;
  roughness: number;
  metalness: number;
  transmission: number;
  thickness: number;
}

function getInitialState(baseColor: string, system: SystemType): MaterialState {
  if (!COLOR_CACHE[baseColor]) {
    COLOR_CACHE[baseColor] = new THREE.Color(baseColor);
  }

  // Return clones so callers can safely mutate them (lerp, etc.)
  let color = COLOR_CACHE[baseColor].clone();
  let emissive = COLOR_BLACK.clone();
  let opacity = 1;
  let transparent = false;
  let roughness = 0.4;
  let metalness = 0.05;
  let transmission = 0;
  let thickness = 0;

  // More realistic material properties based on system
  if (system === 'skeletal') {
    // Bone-like material - slightly glossy, not metallic
    roughness = 0.3;
    metalness = 0.02;
    transmission = 0.05;
    thickness = 0.2;
  } else {
    // Organic tissue - more translucent, less metallic
    roughness = 0.2;
    metalness = 0.01;
    transmission = 0.15;
    thickness = 0.8;
  }

  return {
    color,
    emissive,
    opacity,
    transparent,
    roughness,
    metalness,
    transmission,
    thickness
  };
}

function applySelectionDimming(state: MaterialState, selectedPartId: string | null, isSelected: boolean) {
  if (selectedPartId && !isSelected) {
    state.opacity = 0.15;
    state.transparent = true;
  }
}

function applyHighlighting(state: MaterialState, isHovered: boolean, isSelected: boolean) {
  // Highlight hovered
  if (isHovered && !isSelected) {
    state.emissive.copy(COLOR_HOVER);
    state.metalness = 0.3;
  }

  // Highlight selected
  if (isSelected) {
    state.emissive.copy(COLOR_SELECT);
    state.color.lerp(COLOR_WHITE, 0.3);
    state.metalness = 0.4;
    state.roughness = 0.1;
  }
}

function applyDiseaseEffects(state: MaterialState, activeDisease: DiseaseType, isAffected: boolean) {
  if (isAffected) {
    if (activeDisease === 'heart_attack') {
      state.color.copy(COLOR_HEART_ATTACK);
      state.emissive.copy(COLOR_HEART_ATTACK_EMISSIVE);
      state.roughness = 0.8;
    } else if (activeDisease === 'broken_bone') {
      state.color.copy(COLOR_BROKEN_BONE);
      state.emissive.copy(COLOR_BROKEN_BONE_EMISSIVE);
    } else if (activeDisease === 'common_cold') {
      state.color.copy(COLOR_COMMON_COLD);
      state.emissive.copy(COLOR_COMMON_COLD_EMISSIVE);
      state.transmission = 0.3;
    }
  }
}

function applySystemGhosting(state: MaterialState, activeSystem: SystemType, system: SystemType) {
  if (activeSystem !== 'all' && activeSystem !== system) {
    state.opacity = 0.05;
    state.transparent = true;
    state.color.copy(COLOR_GHOST);
  }
}

export function calculateMaterialProps(
  id: string,
  baseColor: string,
  system: SystemType,
  activeSystem: SystemType,
  activeDisease: DiseaseType,
  selectedPartId: string | null,
  hovered: string | null
): MaterialResult {
  const cacheKey = `${id}-${baseColor}-${system}-${activeSystem}-${activeDisease}-${selectedPartId}-${hovered}`;
  const cached = RESULT_CACHE.get(cacheKey);
  if (cached) return cached;

  const isSelected = selectedPartId === id;
  const isHovered = hovered === id;
  const isAffected = activeDisease !== 'none' && DISEASES[activeDisease].affectedParts.includes(id);

  const state = getInitialState(baseColor, system);

  applySelectionDimming(state, selectedPartId, isSelected);
  applyHighlighting(state, isHovered, isSelected);
  applyDiseaseEffects(state, activeDisease, isAffected);
  applySystemGhosting(state, activeSystem, system);

  const result: MaterialResult = {
    ...state,
    envMapIntensity: 2.0,
    clearcoat: system === 'skeletal' ? 0.3 : 0.1,
    clearcoatRoughness: 0.05
  };

  RESULT_CACHE.set(cacheKey, result);
  return result;
}
