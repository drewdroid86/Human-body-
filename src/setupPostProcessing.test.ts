import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// @ts-ignore
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { initComposer } from './setupPostProcessing';

// Mock dependencies
vi.mock('three', async () => {
  const actual = await vi.importActual('three');
  return {
    ...actual,
    Scene: vi.fn(),
    Camera: vi.fn(),
    WebGLRenderer: vi.fn(),
  };
});

vi.mock('three/examples/jsm/postprocessing/EffectComposer.js', () => {
  const addPassMock = vi.fn();
  const setSizeMock = vi.fn();
  const EffectComposer = vi.fn(function() {
    this.addPass = addPassMock;
    this.setSize = setSizeMock;
  });
  return {
    EffectComposer,
  };
});

vi.mock('three/examples/jsm/postprocessing/RenderPass.js', () => {
  return {
    RenderPass: vi.fn(),
  };
});

vi.mock('three/examples/jsm/postprocessing/NormalPass.js', () => {
  return {
    NormalPass: vi.fn(),
  };
});

// @ts-ignore
import { NormalPass } from 'three/examples/jsm/postprocessing/NormalPass.js';

vi.mock('three/examples/jsm/postprocessing/SSAOPass.js', () => {
  const setSizeMock = vi.fn();
  const SSAOPass = vi.fn(function() {
    this.setSize = setSizeMock;
    this.lumInfluence = 0; // Initialize so the if condition passes
  });
  SSAOPass.OUTPUT = { Default: 0 };
  return {
    SSAOPass,
  };
});

describe('initComposer', () => {
  let scene, camera, renderer;
  let addPassEventTrigger;

  beforeEach(() => {
    vi.clearAllMocks();

    scene = new THREE.Scene();
    camera = new THREE.Camera();
    renderer = new THREE.WebGLRenderer();

    // Mock window.innerWidth and window.innerHeight
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });

    // Mock window.addEventListener to capture the resize handler
    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'resize') {
        addPassEventTrigger = handler;
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates an EffectComposer with the renderer', () => {
    initComposer(scene, camera, renderer);
    expect(EffectComposer).toHaveBeenCalledWith(renderer);
  });

  it('adds RenderPass, NormalPass, and SSAOPass in the exact required order', () => {
    const composer = initComposer(scene, camera, renderer);

    // Check instantiations
    expect(RenderPass).toHaveBeenCalledWith(scene, camera);
    expect(NormalPass).toHaveBeenCalledWith(scene, camera);
    expect(SSAOPass).toHaveBeenCalledWith(scene, camera, 1024, 768);

    // Check addPass calls order
    expect(composer.addPass).toHaveBeenCalledTimes(3);
    const renderPassInstance = vi.mocked(RenderPass).mock.instances[0];
    const normalPassInstance = vi.mocked(NormalPass).mock.instances[0];
    const ssaoPassInstance = vi.mocked(SSAOPass).mock.instances[0];

    expect(composer.addPass).toHaveBeenNthCalledWith(1, renderPassInstance);
    expect(composer.addPass).toHaveBeenNthCalledWith(2, normalPassInstance);
    expect(composer.addPass).toHaveBeenNthCalledWith(3, ssaoPassInstance);
  });

  it('configures SSAOPass settings correctly', () => {
    initComposer(scene, camera, renderer);

    const ssaoPassInstance = vi.mocked(SSAOPass).mock.instances[0];

    expect(ssaoPassInstance.kernelRadius).toBe(16);
    expect(ssaoPassInstance.minDistance).toBe(0.005);
    expect(ssaoPassInstance.maxDistance).toBe(0.1);
    expect(ssaoPassInstance.lumInfluence).toBe(0.7);
    expect(ssaoPassInstance.output).toBe(SSAOPass.OUTPUT.Default);
  });

  it('registers a window resize listener and updates sizes', () => {
    const composer = initComposer(scene, camera, renderer);

    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    const ssaoPassInstance = vi.mocked(SSAOPass).mock.instances[0];

    // Simulate resize event
    window.innerWidth = 800;
    window.innerHeight = 600;

    addPassEventTrigger(); // call the captured resize handler

    expect(composer.setSize).toHaveBeenCalledWith(800, 600);
    expect(ssaoPassInstance.setSize).toHaveBeenCalledWith(800, 600);
  });
});
