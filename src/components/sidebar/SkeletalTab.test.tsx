import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkeletalTab from './SkeletalTab';

describe('SkeletalTab', () => {
  it('renders correctly with all expected content', () => {
    render(<SkeletalTab />);

    // Check for main heading
    expect(screen.getByRole('heading', { level: 2, name: /Skeletal System/i })).toBeInTheDocument();

    // Check for description text
    expect(screen.getByText(/Explore the human skeleton/i)).toBeInTheDocument();
    expect(screen.getByText(/Click on individual bones and joints/i)).toBeInTheDocument();

    // Check for interactive mode section
    expect(screen.getByText('Interactive Mode')).toBeInTheDocument();
    expect(screen.getByText(/Hover over bones to highlight them/i)).toBeInTheDocument();
    expect(screen.getByText(/Click to view detailed information/i)).toBeInTheDocument();
  });

  it('contains the expected structural elements', () => {
    const { container } = render(<SkeletalTab />);

    // Check for the presence of the container div
    const outerDiv = container.firstChild;
    expect(outerDiv).toBeInTheDocument();

    // Verify the structure includes the interactive mode block
    const interactiveModeHeading = screen.getByText('Interactive Mode');
    expect(interactiveModeHeading.closest('div')).toBeInTheDocument();
  });

  it('renders the Bone icon', () => {
    const { container } = render(<SkeletalTab />);
    // lucide-react icons render as svg elements
    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();

    // The Bone icon should be next to 'Interactive Mode'
    const interactiveModeHeading = screen.getByText('Interactive Mode');
    const iconContainer = interactiveModeHeading.previousElementSibling;
    expect(iconContainer?.querySelector('svg')).toBeInTheDocument();
  });
});
