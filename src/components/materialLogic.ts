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

function getInitialState(baseColor: string, system: SystemType): MaterialState {
  let color = new THREE.Color(baseColor);
  let emissive = new THREE.Color(0x000000);
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
    state.emissive.setHex(0x222222);
    state.metalness = 0.3;
  }

  // Highlight selected
  if (isSelected) {
    state.emissive.setHex(0x333333);
    state.color.lerp(new THREE.Color(0xffffff), 0.3);
    state.metalness = 0.4;
    state.roughness = 0.1;
  }
}

function applyDiseaseEffects(state: MaterialState, activeDisease: DiseaseType, isAffected: boolean) {
  if (isAffected) {
    if (activeDisease === 'heart_attack') {
      state.color.setHex(0x330000);
      state.emissive.setHex(0x110000);
      state.roughness = 0.8;
    } else if (activeDisease === 'broken_bone') {
      state.color.setHex(0xffcccc);
      state.emissive.setHex(0x330000);
    } else if (activeDisease === 'common_cold') {
      state.color.setHex(0x66aa66);
      state.emissive.setHex(0x001100);
      state.transmission = 0.3;
    }
  }
}

function applySystemGhosting(state: MaterialState, activeSystem: SystemType, system: SystemType) {
  if (activeSystem !== 'all' && activeSystem !== system) {
    state.opacity = 0.05;
    state.transparent = true;
    state.color.setHex(0x444444);
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
  const isSelected = selectedPartId === id;
  const isHovered = hovered === id;
  const isAffected = activeDisease !== 'none' && DISEASES[activeDisease].affectedParts.includes(id);

  const state = getInitialState(baseColor, system);

  applySelectionDimming(state, selectedPartId, isSelected);
  applyHighlighting(state, isHovered, isSelected);
  applyDiseaseEffects(state, activeDisease, isAffected);
  applySystemGhosting(state, activeSystem, system);

  return {
    ...state,
    envMapIntensity: 1.5,
    clearcoat: system === 'skeletal' ? 0.5 : 0.2,
    clearcoatRoughness: 0.1
  };
}
