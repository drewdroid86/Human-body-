import { describe, it } from 'node:test';
import assert from 'node:assert';
import { appReducer, initialState } from './appState.ts';

// Type only import
import type { AppState } from './appState.ts';

describe('appReducer', () => {
  it('should handle SET_TAB to "skeletal"', () => {
    const action = { type: 'SET_TAB', payload: 'skeletal' } as const;
    const newState = appReducer(initialState, action);

    assert.strictEqual(newState.activeTab, 'skeletal');
    assert.strictEqual(newState.activeSystem, 'skeletal');
    assert.strictEqual(newState.activeDisease, 'none');
    assert.strictEqual(newState.selectedPartId, null);
  });

  it('should handle SET_TAB to "systems"', () => {
    // Start with a different state to ensure it resets correctly
    const startState: AppState = {
      ...initialState,
      activeTab: 'skeletal',
      activeSystem: 'skeletal',
      selectedPartId: 'skull',
    };

    const action = { type: 'SET_TAB', payload: 'systems' } as const;
    const newState = appReducer(startState, action);

    assert.strictEqual(newState.activeTab, 'systems');
    assert.strictEqual(newState.activeSystem, 'all');
    assert.strictEqual(newState.activeDisease, 'none');
    assert.strictEqual(newState.selectedPartId, null);
  });

  it('should handle SET_TAB to "diseases"', () => {
    // Start with a different state
    const startState: AppState = {
      ...initialState,
      activeSystem: 'skeletal', // Simulate coming from skeletal tab
      selectedPartId: 'femur',
    };

    const action = { type: 'SET_TAB', payload: 'diseases' } as const;
    const newState = appReducer(startState, action);

    assert.strictEqual(newState.activeTab, 'diseases');
    assert.strictEqual(newState.activeSystem, 'all');
  });

  it('should handle SET_SYSTEM', () => {
    const action = { type: 'SET_SYSTEM', payload: 'nervous' } as const;
    const newState = appReducer(initialState, action);
    assert.strictEqual(newState.activeSystem, 'nervous');
  });

  it('should handle SET_DISEASE', () => {
    const action = { type: 'SET_DISEASE', payload: 'heart_attack' } as const;
    const newState = appReducer(initialState, action);
    assert.strictEqual(newState.activeDisease, 'heart_attack');
  });

  it('should handle SELECT_PART', () => {
    const action = { type: 'SELECT_PART', payload: 'heart' } as const;
    const newState = appReducer(initialState, action);
    assert.strictEqual(newState.selectedPartId, 'heart');
  });
});
