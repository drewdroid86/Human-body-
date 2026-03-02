import { describe, it, expect } from 'vitest';
import { appReducer, initialState } from './appState.ts';

// Type only import
import type { AppState } from './appState.ts';

describe('appReducer', () => {
  it('should handle SET_TAB to "skeletal"', () => {
    const action = { type: 'SET_TAB', payload: 'skeletal' } as const;
    const newState = appReducer(initialState, action);

    expect(newState.activeTab).toBe('skeletal');
    expect(newState.activeSystem).toBe('skeletal');
    expect(newState.activeDisease).toBe('none');
    expect(newState.selectedPartId).toBeNull();
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

    expect(newState.activeTab).toBe('systems');
    expect(newState.activeSystem).toBe('all');
    expect(newState.activeDisease).toBe('none');
    expect(newState.selectedPartId).toBeNull();
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

    expect(newState.activeTab).toBe('diseases');
    expect(newState.activeSystem).toBe('all');
  });

  it('should handle SET_SYSTEM', () => {
    const action = { type: 'SET_SYSTEM', payload: 'nervous' } as const;
    const newState = appReducer(initialState, action);
    expect(newState.activeSystem).toBe('nervous');
  });

  it('should handle SET_DISEASE', () => {
    const action = { type: 'SET_DISEASE', payload: 'heart_attack' } as const;
    const newState = appReducer(initialState, action);
    expect(newState.activeDisease).toBe('heart_attack');
  });

  it('should handle SELECT_PART', () => {
    const action = { type: 'SELECT_PART', payload: 'heart' } as const;
    const newState = appReducer(initialState, action);
    expect(newState.selectedPartId).toBe('heart');
  });
});
