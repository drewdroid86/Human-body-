import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from './Sidebar';
import { DISEASES } from '../data';

describe('Sidebar', () => {
  const defaultProps = {
    activeTab: 'systems' as const,
    onTabChange: vi.fn(),
    activeSystem: 'all' as const,
    onSystemChange: vi.fn(),
    activeDisease: 'none' as const,
    onDiseaseChange: vi.fn(),
    showShell: true,
    onToggleShell: vi.fn(),
  };

  it('renders correctly with title and description', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Anatomy Explorer')).toBeInTheDocument();
    expect(screen.getByText('Interactive 3D Human Body')).toBeInTheDocument();
  });

  it('calls onToggleShell when body shell toggle is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    // Find the toggle button after "Body Shell"
    const shellText = screen.getByText('Body Shell');
    const toggleButton = shellText.nextElementSibling;
    if (toggleButton) {
      fireEvent.click(toggleButton);
    }
    expect(defaultProps.onToggleShell).toHaveBeenCalled();
  });

  it('renders tabs and calls onTabChange when a tab is clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const skeletalTab = screen.getByText('Skeletal');
    fireEvent.click(skeletalTab);
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('skeletal');

    const diseasesTab = screen.getByText('Diseases');
    fireEvent.click(diseasesTab);
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('diseases');
  });

  it('renders system buttons and calls onSystemChange when one is clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const circulatoryButton = screen.getByText('Circulatory System');
    fireEvent.click(circulatoryButton);
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('circulatory');
  });

  it('renders skeletal tab content when activeTab is skeletal', () => {
    render(<Sidebar {...defaultProps} activeTab="skeletal" />);
    expect(screen.getByText('Skeletal System')).toBeInTheDocument();
    expect(screen.getByText(/Explore the human skeleton/)).toBeInTheDocument();
  });

  it('renders disease buttons and calls onDiseaseChange when one is clicked', () => {
    render(<Sidebar {...defaultProps} activeTab="diseases" />);

    const heartAttackButton = screen.getByText(DISEASES.heart_attack.name);
    fireEvent.click(heartAttackButton);
    expect(defaultProps.onDiseaseChange).toHaveBeenCalledWith('heart_attack');
  });

  it('shows disease description when a disease is active', () => {
    render(<Sidebar {...defaultProps} activeTab="diseases" activeDisease="heart_attack" />);
    expect(screen.getByText('Pathology Active')).toBeInTheDocument();
    expect(screen.getByText(DISEASES.heart_attack.description)).toBeInTheDocument();
  });
});
