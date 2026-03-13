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

  it('renders all diseases from the DISEASES data as buttons', () => {
    render(<DiseasesTab {...defaultProps} />);
    expect(screen.getByText('Healthy State')).toBeInTheDocument();
    expect(screen.getByText('Heart Attack (Myocardial Infarction)')).toBeInTheDocument();
    expect(screen.getByText('Broken Bone (Fracture)')).toBeInTheDocument();
    expect(screen.getByText('Common Cold')).toBeInTheDocument();
  });

  it('calls onDiseaseChange with "none" when Healthy State is clicked', async () => {
    const user = userEvent.setup();
    render(<DiseasesTab {...defaultProps} activeDisease="heart_attack" />);

    await user.click(screen.getByText('Healthy State'));
    expect(defaultProps.onDiseaseChange).toHaveBeenCalledWith('none');
  });

  it('renders active state marker for the selected disease', () => {
    const { container } = render(<DiseasesTab {...defaultProps} activeDisease="heart_attack" />);

    // Find the active button
    const activeButton = screen.getByText('Heart Attack (Myocardial Infarction)').closest('button');
    expect(activeButton).toHaveClass('bg-rose-500/20', 'text-rose-300');

    // Find the inactive button
    const inactiveButton = screen.getByText('Healthy State').closest('button');
    expect(inactiveButton).toHaveClass('text-zinc-400');
  });
});
