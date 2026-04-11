import * as THREE from 'three';
import { DISEASES } from '../data';
import type { SystemType, DiseaseType } from '../data';

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

/**
 * Performance Optimization:
 * 1. Color cache to avoid repeated string parsing and object creation.
 * 2. Pre-allocated constants for fixed colors in the hot path.
 * 3. Result memoization to avoid redundant calculations and allocations.
 */

const COLOR_CACHE: Record<string, THREE.Color> = {};
const getCachedColor = (colorStr: string) => {
  if (!COLOR_CACHE[colorStr]) {
    COLOR_CACHE[colorStr] = new THREE.Color(colorStr);
  }
  return COLOR_CACHE[colorStr];
};

const COLOR_BLACK = new THREE.Color(0x000000);
const COLOR_WHITE = new THREE.Color(0xffffff);
const COLOR_HOVER = new THREE.Color(0x222222);
const COLOR_SELECTED = new THREE.Color(0x333333);
const COLOR_HEART_ATTACK = new THREE.Color(0x330000);
const COLOR_HEART_ATTACK_EMISSIVE = new THREE.Color(0x110000);
const COLOR_BROKEN_BONE = new THREE.Color(0xffcccc);
const COLOR_COLD = new THREE.Color(0x66aa66);
const COLOR_COLD_EMISSIVE = new THREE.Color(0x001100);
const COLOR_GHOST = new THREE.Color(0x444444);

// Reusable scratchpad colors to avoid allocation in modification functions
const _tempColor = new THREE.Color();

const RESULT_CACHE = new Map<string, MaterialResult>();

function getInitialState(baseColor: string, system: SystemType): MaterialState {
  // Clone from cache to allow safe mutation in apply functions
  const color = getCachedColor(baseColor).clone();
  const emissive = COLOR_BLACK.clone();
  let opacity = 1;
  let transparent = false;
  let roughness = 0.3;
  let metalness = 0.1;
  let transmission = 0;
  let thickness = 0;

  // Organic look for organs
  if (system !== 'skeletal') {
    roughness = 0.2;
    transmission = 0.1;
    thickness = 0.5;
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
    state.emissive.copy(COLOR_SELECTED);
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
      state.emissive.copy(COLOR_HEART_ATTACK); // Original hex match: 0x330000
    } else if (activeDisease === 'common_cold') {
      state.color.copy(COLOR_COLD);
      state.emissive.copy(COLOR_COLD_EMISSIVE);
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
  // Cache check - keys are stable for given state
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
    envMapIntensity: 1.5,
    clearcoat: system === 'skeletal' ? 0.5 : 0.2,
    clearcoatRoughness: 0.1
  };

  RESULT_CACHE.set(cacheKey, result);
  return result;
}
