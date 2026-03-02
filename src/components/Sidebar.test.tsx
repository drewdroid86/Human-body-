import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from './Sidebar';

// Mock sub-components to focus on Sidebar logic
vi.mock('./sidebar/SystemsTab', () => ({
  default: () => <div data-testid="systems-tab">Systems Tab Content</div>
}));
vi.mock('./sidebar/SkeletalTab', () => ({
  default: () => <div data-testid="skeletal-tab">Skeletal Tab Content</div>
}));
vi.mock('./sidebar/DiseasesTab', () => ({
  default: () => <div data-testid="diseases-tab">Diseases Tab Content</div>
}));

describe('Sidebar', () => {
  const defaultProps = {
    activeTab: 'systems' as const,
    onTabChange: vi.fn(),
    activeSystem: 'all' as const,
    onSystemChange: vi.fn(),
    activeDisease: 'none' as const,
    onDiseaseChange: vi.fn(),
  };

  it('renders Sidebar header and initial tab correctly', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText('Anatomy Explorer')).toBeInTheDocument();
    expect(screen.getByText('Systems')).toBeInTheDocument();
    expect(screen.getByText('Skeletal')).toBeInTheDocument();
    expect(screen.getByText('Diseases')).toBeInTheDocument();

    // Verify correct tab component is rendered
    expect(screen.getByTestId('systems-tab')).toBeInTheDocument();
  });

  it('calls onTabChange when a tab button is clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /Skeletal/ }));
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('skeletal');

    await user.click(screen.getByRole('button', { name: /Diseases/ }));
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('diseases');
  });

  it('renders the correct tab component based on activeTab prop', () => {
    const { rerender } = render(<Sidebar {...defaultProps} activeTab="skeletal" />);
    expect(screen.getByTestId('skeletal-tab')).toBeInTheDocument();

    rerender(<Sidebar {...defaultProps} activeTab="diseases" />);
    expect(screen.getByTestId('diseases-tab')).toBeInTheDocument();
  });
});
