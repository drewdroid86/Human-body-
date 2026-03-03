import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { calculateMaterialProps } from './materialLogic';

describe('calculateMaterialProps', () => {
  it('should return default properties for skeletal system', () => {
    const props = calculateMaterialProps(
      'skull',
      '#ffffff',
      'skeletal',
      'all',
      'none',
      null,
      null
    );

    expect(props.opacity).toBe(1);
    expect(props.transparent).toBe(false);
    expect(props.roughness).toBe(0.3);
    expect(props.metalness).toBe(0.1);
    expect(props.transmission).toBe(0);
    expect(props.thickness).toBe(0);
  });

  it('should return organic properties for non-skeletal system', () => {
    const props = calculateMaterialProps(
      'heart',
      '#ff0000',
      'circulatory',
      'all',
      'none',
      null,
      null
    );

    expect(props.roughness).toBe(0.2);
    expect(props.transmission).toBe(0.1);
    expect(props.thickness).toBe(0.5);
  });

  it('should dim non-selected parts when a part is selected', () => {
    const props = calculateMaterialProps(
      'skull',
      '#ffffff',
      'skeletal',
      'all',
      'none',
      'spine', // spine is selected, skull is not
      null
    );

    expect(props.opacity).toBe(0.15);
    expect(props.transparent).toBe(true);
  });

  it('should highlight hovered part', () => {
    const props = calculateMaterialProps(
      'skull',
      '#ffffff',
      'skeletal',
      'all',
      'none',
      null,
      'skull' // hovered
    );

    expect(props.emissive.getHexString()).toBe('222222');
    expect(props.metalness).toBe(0.3);
  });

  it('should highlight selected part', () => {
    const props = calculateMaterialProps(
      'skull',
      '#ffffff',
      'skeletal',
      'all',
      'none',
      'skull', // selected
      null
    );

    expect(props.emissive.getHexString()).toBe('333333');
    expect(props.metalness).toBe(0.4);
    expect(props.roughness).toBe(0.1);
  });

  it('should apply disease effects for heart attack', () => {
    const props = calculateMaterialProps(
      'heart',
      '#ff0000',
      'circulatory',
      'all',
      'heart_attack',
      null,
      null
    );

    expect(props.color.getHexString()).toBe('330000');
    expect(props.emissive.getHexString()).toBe('110000');
    expect(props.roughness).toBe(0.8);
  });

   it('should apply ghost effect for inactive systems', () => {
    const props = calculateMaterialProps(
      'skull',
      '#ffffff',
      'skeletal',
      'circulatory', // active system is circulatory
      'none',
      null,
      null
    );

    expect(props.opacity).toBe(0.05);
    expect(props.transparent).toBe(true);
    expect(props.color.getHexString()).toBe('444444');
  });
});
