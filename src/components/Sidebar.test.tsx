import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  const defaultProps = {
    activeTab: 'systems' as const,
    onTabChange: vi.fn(),
    activeSystem: 'all' as const,
    onSystemChange: vi.fn(),
    activeDisease: 'none' as const,
    onDiseaseChange: vi.fn(),
  };

  it('renders correctly with initial props', () => {
    render(<Sidebar {...defaultProps} />);

    // Check for title
    expect(screen.getByText('Anatomy Explorer')).toBeInTheDocument();

    // Check for initial tab buttons
    expect(screen.getByText('Systems')).toBeInTheDocument();
    expect(screen.getByText('Skeletal')).toBeInTheDocument();
    expect(screen.getByText('Diseases')).toBeInTheDocument();

    // Check for initial content (Systems tab is active)
    expect(screen.getByText('Organ Systems')).toBeInTheDocument();
    expect(screen.getByText('Full Body')).toBeInTheDocument();
  });

  it('calls onTabChange when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...defaultProps} />);

    await user.click(screen.getByText('Skeletal'));
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('skeletal');

    await user.click(screen.getByText('Diseases'));
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('diseases');
  });

  it('calls onSystemChange when a system is selected', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...defaultProps} />);

    // Ensure we are on systems tab
    expect(screen.getByText('Organ Systems')).toBeInTheDocument();

    await user.click(screen.getByText('Circulatory System'));
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('circulatory');

    await user.click(screen.getByText('Nervous System'));
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('nervous');
  });

  it('renders Skeletal tab content correctly', () => {
    render(<Sidebar {...defaultProps} activeTab="skeletal" />);

    expect(screen.getByText('Skeletal System')).toBeInTheDocument();
    expect(screen.getByText('Interactive Mode')).toBeInTheDocument();
  });

  it('renders Diseases tab content and calls onDiseaseChange', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...defaultProps} activeTab="diseases" />);

    expect(screen.getByText('Conditions & Pathology')).toBeInTheDocument();

    await user.click(screen.getByText('Heart Attack (Myocardial Infarction)'));
    expect(defaultProps.onDiseaseChange).toHaveBeenCalledWith('heart_attack');

    await user.click(screen.getByText('Broken Bone (Fracture)'));
    expect(defaultProps.onDiseaseChange).toHaveBeenCalledWith('broken_bone');
  });

  it('displays disease description when a disease is active', () => {
    render(<Sidebar {...defaultProps} activeTab="diseases" activeDisease="heart_attack" />);

    expect(screen.getByText('Pathology Active')).toBeInTheDocument();
    // Use a regex or part of the string to match description
    expect(screen.getByText(/Occurs when blood flow decreases or stops/i)).toBeInTheDocument();
  });
});
