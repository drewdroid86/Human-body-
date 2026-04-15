import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoPanel from './InfoPanel';
import { DISEASES, BODY_PARTS } from '../data';
import { describe, it, expect } from 'vitest';

describe('InfoPanel', () => {
  it('renders default state when no part is selected', () => {
    render(<InfoPanel selectedPartId={null} activeDisease="none" />);

    expect(screen.getByText('Select a body part to view details')).toBeInTheDocument();
  });

  it('renders part information when a part is selected', () => {
    const partId = 'heart';
    const partInfo = BODY_PARTS[partId];
    render(<InfoPanel selectedPartId={partId} activeDisease="none" />);

    expect(screen.getByText(partInfo.name)).toBeInTheDocument();

    const systemElements = screen.getAllByText(new RegExp(partInfo.system, 'i'));
    expect(systemElements.length).toBeGreaterThan(0);
    expect(systemElements[0]).toBeInTheDocument();

    expect(screen.getByText(partInfo.description)).toBeInTheDocument();
    expect(screen.getByText(partInfo.function)).toBeInTheDocument();
    expect(screen.queryByText('Select a body part to view details')).not.toBeInTheDocument();
  });

  it('renders disease impact when active disease affects the selected part', () => {
    const partId = 'heart';
    const activeDisease = 'heart_attack';
    const diseaseInfo = DISEASES[activeDisease];
    const partInfo = BODY_PARTS[partId];

    render(<InfoPanel selectedPartId={partId} activeDisease={activeDisease} />);

    expect(screen.getByText('Pathology Impact')).toBeInTheDocument();
    expect(screen.getByText(`The ${partInfo.name.toLowerCase()} is directly affected by ${diseaseInfo.name.toLowerCase()}.`)).toBeInTheDocument();
  });

  it('does not render disease impact when active disease does not affect the selected part', () => {
    const partId = 'heart';
    const activeDisease = 'broken_bone'; // Affects femur, not heart

    render(<InfoPanel selectedPartId={partId} activeDisease={activeDisease} />);

    expect(screen.queryByText('Pathology Impact')).not.toBeInTheDocument();
  });
});
