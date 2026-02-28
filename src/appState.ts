// Remove dependency on data.ts for types to make tests self-contained and avoid loader issues with types
export type SystemType = 'all' | 'skeletal' | 'circulatory' | 'nervous' | 'digestive' | 'respiratory';
export type DiseaseType = 'none' | 'heart_attack' | 'broken_bone' | 'common_cold';

export interface AppState {
  activeTab: 'systems' | 'skeletal' | 'diseases';
  activeSystem: SystemType;
  activeDisease: DiseaseType;
  selectedPartId: string | null;
}

export const initialState: AppState = {
  activeTab: 'systems',
  activeSystem: 'all',
  activeDisease: 'none',
  selectedPartId: null,
};

export type AppAction =
  | { type: 'SET_TAB'; payload: 'systems' | 'skeletal' | 'diseases' }
  | { type: 'SET_SYSTEM'; payload: SystemType }
  | { type: 'SET_DISEASE'; payload: DiseaseType }
  | { type: 'SELECT_PART'; payload: string | null };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TAB': {
      const tab = action.payload;
      let updates: Partial<AppState> = {
        activeTab: tab,
        selectedPartId: null,
      };

      if (tab === 'skeletal') {
        updates.activeSystem = 'skeletal';
        updates.activeDisease = 'none';
      } else if (tab === 'systems') {
        updates.activeSystem = 'all';
        updates.activeDisease = 'none';
      } else if (tab === 'diseases') {
        updates.activeSystem = 'all';
      }

      return { ...state, ...updates };
    }
    case 'SET_SYSTEM':
      return { ...state, activeSystem: action.payload };
    case 'SET_DISEASE':
      return { ...state, activeDisease: action.payload };
    case 'SELECT_PART':
      return { ...state, selectedPartId: action.payload };
    default:
      return state;
  }
}
