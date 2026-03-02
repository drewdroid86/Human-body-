import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DiseasesTab from './DiseasesTab';

describe('DiseasesTab', () => {
  const defaultProps = {
    activeDisease: 'none' as const,
    onDiseaseChange: vi.fn(),
  };

  it('renders correctly with initial props', () => {
    render(<DiseasesTab {...defaultProps} />);
    expect(screen.getByText('Conditions & Pathology')).toBeInTheDocument();
    expect(screen.getByText('Healthy State')).toBeInTheDocument();
    expect(screen.getByText('Heart Attack (Myocardial Infarction)')).toBeInTheDocument();
  });

  it('calls onDiseaseChange when a disease is selected', async () => {
    const user = userEvent.setup();
    render(<DiseasesTab {...defaultProps} />);

    await user.click(screen.getByText('Heart Attack (Myocardial Infarction)'));
    expect(defaultProps.onDiseaseChange).toHaveBeenCalledWith('heart_attack');

    await user.click(screen.getByText('Broken Bone (Fracture)'));
    expect(defaultProps.onDiseaseChange).toHaveBeenCalledWith('broken_bone');
  });

  it('displays disease description when a disease is active', () => {
    render(<DiseasesTab {...defaultProps} activeDisease="heart_attack" />);

    expect(screen.getByText('Pathology Active')).toBeInTheDocument();
    expect(screen.getByText(/Occurs when blood flow decreases or stops/i)).toBeInTheDocument();
  });
});
