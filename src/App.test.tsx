import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { TABS } from './data';

// Mock child components to isolate App testing and avoid Three.js rendering issues
vi.mock('./components/Sidebar', () => ({
  default: ({
    activeTab,
    onTabChange,
    activeSystem,
    onSystemChange,
    activeDisease,
    onDiseaseChange,
  }: any) => (
    <div data-testid="mock-sidebar">
      <div data-testid="active-tab">{activeTab}</div>
      <div data-testid="active-system">{activeSystem}</div>
      <div data-testid="active-disease">{activeDisease}</div>
      <button onClick={() => onTabChange(TABS.SKELETAL)}>Change to Skeletal</button>
      <button onClick={() => onTabChange(TABS.SYSTEMS)}>Change to Systems</button>
      <button onClick={() => onTabChange(TABS.DISEASES)}>Change to Diseases</button>
      <button onClick={() => onSystemChange('nervous')}>Change System to Nervous</button>
      <button onClick={() => onDiseaseChange('heart_attack')}>Change Disease to Heart Attack</button>
    </div>
  ),
}));

vi.mock('./components/HumanBodyCanvas', () => ({
  default: ({ activeSystem, activeDisease, selectedPartId, onSelectPart }: any) => (
    <div data-testid="mock-canvas">
      <div data-testid="canvas-active-system">{activeSystem}</div>
      <div data-testid="canvas-active-disease">{activeDisease}</div>
      <div data-testid="canvas-selected-part">{selectedPartId || 'none'}</div>
      <button onClick={() => onSelectPart('brain')}>Select Brain</button>
    </div>
  ),
}));

vi.mock('./components/InfoPanel', () => ({
  default: ({ selectedPartId, activeDisease }: any) => (
    <div data-testid="mock-infopanel">
      <div data-testid="info-selected-part">{selectedPartId || 'none'}</div>
      <div data-testid="info-active-disease">{activeDisease}</div>
    </div>
  ),
}));

describe('App Component', () => {
  it('renders with default state', () => {
    render(<App />);

    expect(screen.getByTestId('active-tab')).toHaveTextContent(TABS.SYSTEMS);
    expect(screen.getByTestId('active-system')).toHaveTextContent('all');
    expect(screen.getByTestId('active-disease')).toHaveTextContent('none');
    expect(screen.getByTestId('canvas-selected-part')).toHaveTextContent('none');
  });

  it('handles changing tab to SKELETAL correctly', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Select brain first to verify it gets cleared
    await user.click(screen.getByText('Select Brain'));
    expect(screen.getByTestId('canvas-selected-part')).toHaveTextContent('brain');

    await user.click(screen.getByText('Change to Skeletal'));

    expect(screen.getByTestId('active-tab')).toHaveTextContent(TABS.SKELETAL);
    expect(screen.getByTestId('active-system')).toHaveTextContent('skeletal');
    expect(screen.getByTestId('active-disease')).toHaveTextContent('none');
    expect(screen.getByTestId('canvas-selected-part')).toHaveTextContent('none');
  });

  it('handles changing tab to SYSTEMS correctly', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Setup some state
    await user.click(screen.getByText('Change to Skeletal'));
    await user.click(screen.getByText('Select Brain'));

    // Change back to Systems
    await user.click(screen.getByText('Change to Systems'));

    expect(screen.getByTestId('active-tab')).toHaveTextContent(TABS.SYSTEMS);
    expect(screen.getByTestId('active-system')).toHaveTextContent('all');
    expect(screen.getByTestId('active-disease')).toHaveTextContent('none');
    expect(screen.getByTestId('canvas-selected-part')).toHaveTextContent('none');
  });

  it('handles changing tab to DISEASES correctly', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Setup some state
    await user.click(screen.getByText('Change System to Nervous'));
    await user.click(screen.getByText('Select Brain'));

    await user.click(screen.getByText('Change to Diseases'));

    expect(screen.getByTestId('active-tab')).toHaveTextContent(TABS.DISEASES);
    expect(screen.getByTestId('active-system')).toHaveTextContent('all');
    // activeDisease shouldn't be reset to none when switching to DISEASES tab
    expect(screen.getByTestId('canvas-selected-part')).toHaveTextContent('none');
  });

  it('handles changing active system', async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText('Change System to Nervous'));

    expect(screen.getByTestId('active-system')).toHaveTextContent('nervous');
    expect(screen.getByTestId('canvas-active-system')).toHaveTextContent('nervous');
  });

  it('handles changing active disease', async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText('Change Disease to Heart Attack'));

    expect(screen.getByTestId('active-disease')).toHaveTextContent('heart_attack');
    expect(screen.getByTestId('canvas-active-disease')).toHaveTextContent('heart_attack');
    expect(screen.getByTestId('info-active-disease')).toHaveTextContent('heart_attack');
  });

  it('handles selecting a part', async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText('Select Brain'));

    expect(screen.getByTestId('canvas-selected-part')).toHaveTextContent('brain');
    expect(screen.getByTestId('info-selected-part')).toHaveTextContent('brain');
  });
});
