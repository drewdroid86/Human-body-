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

    await user.click(screen.getByText('Full Body'));
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('all');

    await user.click(screen.getByText('Circulatory System'));
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('circulatory');

    await user.click(screen.getByText('Nervous System'));
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('nervous');

    await user.click(screen.getByText('Digestive System'));
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('digestive');

    await user.click(screen.getByText('Respiratory System'));
    expect(defaultProps.onSystemChange).toHaveBeenCalledWith('respiratory');
  });

  it('applies aria-current to the active system button', () => {
    const { rerender } = render(<SystemsTab {...defaultProps} activeSystem="all" />);

    expect(screen.getByRole('button', { name: /Full Body/i })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: /Circulatory System/i })).not.toHaveAttribute('aria-current');

    rerender(<SystemsTab {...defaultProps} activeSystem="circulatory" />);

    expect(screen.getByRole('button', { name: /Full Body/i })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: /Circulatory System/i })).toHaveAttribute('aria-current', 'true');
  });
});
