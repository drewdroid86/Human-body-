import { describe, it } from 'node:test';
import assert from 'node:assert';
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

    assert.strictEqual(props.opacity, 1);
    assert.strictEqual(props.transparent, false);
    assert.strictEqual(props.roughness, 0.3);
    assert.strictEqual(props.metalness, 0.1);
    assert.strictEqual(props.transmission, 0);
    assert.strictEqual(props.thickness, 0);
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

    assert.strictEqual(props.roughness, 0.2);
    assert.strictEqual(props.transmission, 0.1);
    assert.strictEqual(props.thickness, 0.5);
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

    assert.strictEqual(props.opacity, 0.15);
    assert.strictEqual(props.transparent, true);
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

    assert.strictEqual(props.emissive.getHexString(), '222222');
    assert.strictEqual(props.metalness, 0.3);
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

    assert.strictEqual(props.emissive.getHexString(), '333333');
    assert.strictEqual(props.metalness, 0.4);
    assert.strictEqual(props.roughness, 0.1);
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

    assert.strictEqual(props.color.getHexString(), '330000');
    assert.strictEqual(props.emissive.getHexString(), '110000');
    assert.strictEqual(props.roughness, 0.8);
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

    assert.strictEqual(props.opacity, 0.05);
    assert.strictEqual(props.transparent, true);
    assert.strictEqual(props.color.getHexString(), '444444');
  });
});
