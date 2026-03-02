import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SystemsTab from './SystemsTab';

describe('SystemsTab', () => {
  const defaultProps = {
    activeSystem: 'all' as const,
    onSystemChange: vi.fn(),
  };

  it('renders correctly with initial props', () => {
    render(<SystemsTab {...defaultProps} />);
    expect(screen.getByText('Organ Systems')).toBeInTheDocument();
    expect(screen.getByText('Full Body')).toBeInTheDocument();
    expect(screen.getByText('Circulatory System')).toBeInTheDocument();
    expect(screen.getByText('Nervous System')).toBeInTheDocument();
    expect(screen.getByText('Digestive System')).toBeInTheDocument();
    expect(screen.getByText('Respiratory System')).toBeInTheDocument();
  });

  it('calls onSystemChange when a system is selected', async () => {
    const user = userEvent.setup();
    render(<SystemsTab {...defaultProps} />);

    await user.click(screen.getByText('Circulatory System'));
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('circulatory');

    await user.click(screen.getByText('Nervous System'));
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('nervous');
  });
});
