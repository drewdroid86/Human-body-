import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkeletalTab from './SkeletalTab';

describe('SkeletalTab', () => {
  it('renders correctly', () => {
    render(<SkeletalTab />);
    expect(screen.getByText('Skeletal System')).toBeInTheDocument();
    expect(screen.getByText(/Explore the human skeleton/i)).toBeInTheDocument();
    expect(screen.getByText('Interactive Mode')).toBeInTheDocument();
  });
});
