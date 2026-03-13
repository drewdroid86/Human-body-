import { render, screen } from '@testing-library/react';
import React from 'react';
import InfoPanel from './InfoPanel';
import { BODY_PARTS, DISEASES } from '../data';
import { describe, it, expect } from 'vitest';

describe('InfoPanel', () => {
  it('renders empty state when no part is selected', () => {
    render(<InfoPanel selectedPartId={null} activeDisease="none" />);
    expect(screen.getByText('Select a body part to view details')).toBeInTheDocument();
  });

  it('renders part details when a part is selected', () => {
    render(<InfoPanel selectedPartId="skull" activeDisease="none" />);

    // Check that the empty state is not present
    expect(screen.queryByText('Select a body part to view details')).not.toBeInTheDocument();

    const partInfo = BODY_PARTS['skull'];

    // Check main details
    expect(screen.getByText(partInfo.name)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(partInfo.system, 'i'))).toBeInTheDocument();
    expect(screen.getByText(partInfo.description)).toBeInTheDocument();
    expect(screen.getByText(partInfo.function)).toBeInTheDocument();
  });

  it('does not render pathology impact for unrelated disease', () => {
    // heart_attack does not affect the skull
    render(<InfoPanel selectedPartId="skull" activeDisease="heart_attack" />);

    expect(screen.queryByText('Pathology Impact')).not.toBeInTheDocument();
  });

  it('renders pathology impact for related disease', () => {
    // heart_attack affects the heart
    render(<InfoPanel selectedPartId="heart" activeDisease="heart_attack" />);

    const partInfo = BODY_PARTS['heart'];
    const diseaseInfo = DISEASES['heart_attack'];

    expect(screen.getByText('Pathology Impact')).toBeInTheDocument();
    expect(
      screen.getByText(`The ${partInfo.name.toLowerCase()} is directly affected by ${diseaseInfo.name.toLowerCase()}.`)
    ).toBeInTheDocument();
  });
});
