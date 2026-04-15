import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoPanel from './InfoPanel';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../data', async () => {
  const actual = await vi.importActual('../data');
  return {
    ...actual as any,
    BODY_PARTS: {
      heart: {
        id: 'heart',
        name: 'Heart',
        system: 'circulatory',
        description: 'A muscular organ in most animals, which pumps blood through the blood vessels of the circulatory system.',
        function: 'Pumps oxygenated blood to the body and deoxygenated blood to the lungs.'
      }
    },
    DISEASES: {
      heart_attack: {
        id: 'heart_attack',
        name: 'Heart Attack (Myocardial Infarction)',
        description: 'Occurs when blood flow decreases or stops to a part of the heart, causing damage to the heart muscle.',
        affectedParts: ['heart']
      },
      broken_bone: {
        id: 'broken_bone',
        name: 'Broken Bone (Fracture)',
        description: 'A medical condition in which there is a partial or complete break in the continuity of the bone. In this example, the femur is affected.',
        affectedParts: ['femur']
      }
    }
  };
});

describe('InfoPanel', () => {
  const mockDiseases = {
    heart_attack: {
      id: 'heart_attack',
      name: 'Heart Attack (Myocardial Infarction)',
      description: 'Occurs when blood flow decreases or stops to a part of the heart, causing damage to the heart muscle.',
      affectedParts: ['heart']
    },
    broken_bone: {
      id: 'broken_bone',
      name: 'Broken Bone (Fracture)',
      description: 'A medical condition in which there is a partial or complete break in the continuity of the bone. In this example, the femur is affected.',
      affectedParts: ['femur']
    }
  };

  const mockBodyParts = {
    heart: {
      id: 'heart',
      name: 'Heart',
      system: 'circulatory',
      description: 'A muscular organ in most animals, which pumps blood through the blood vessels of the circulatory system.',
      function: 'Pumps oxygenated blood to the body and deoxygenated blood to the lungs.'
    }
  };

  it('renders default state when no part is selected', () => {
    render(<InfoPanel selectedPartId={null} activeDisease="none" />);

    expect(screen.getByText('Select a body part to view details')).toBeInTheDocument();
  });

  it('renders part information when a part is selected', () => {
    const partId = 'heart';
    const partInfo = mockBodyParts[partId as keyof typeof mockBodyParts];
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
    const diseaseInfo = mockDiseases[activeDisease as keyof typeof mockDiseases];
    const partInfo = mockBodyParts[partId as keyof typeof mockBodyParts];

    render(<InfoPanel selectedPartId={partId} activeDisease={activeDisease as any} />);

    expect(screen.getByText('Pathology Impact')).toBeInTheDocument();
    expect(screen.getByText(`The ${partInfo.name.toLowerCase()} is directly affected by ${diseaseInfo.name.toLowerCase()}.`)).toBeInTheDocument();
  });

  it('does not render disease impact when active disease does not affect the selected part', () => {
    const partId = 'heart';
    const activeDisease = 'broken_bone'; // Affects femur, not heart

    render(<InfoPanel selectedPartId={partId} activeDisease={activeDisease as any} />);

    expect(screen.queryByText('Pathology Impact')).not.toBeInTheDocument();
  });
});
