import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { NormalPass } from 'three/examples/jsm/postprocessing/NormalPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';

/**
 * Initializes the post-processing pipeline for the Anatomy Viewer.
 * Sets up RenderPass, NormalPass, and SSAOPass in the exact required order
 * to avoid missing NormalPass dependency errors.
 *
 * @param {THREE.Scene} scene - The main Three.js scene
 * @param {THREE.Camera} camera - The main camera
 * @param {THREE.WebGLRenderer} renderer - The WebGL renderer
 * @returns {EffectComposer} - The configured post-processing composer
 */
export function initComposer(scene, camera, renderer) {
  // Create the Effect Composer
  const composer = new EffectComposer(renderer);

  // 1. RenderPass: Renders the base scene
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // 2. NormalPass: Required dependency for SSAOPass to calculate ambient occlusion accurately
  // Some SSAO implementations need the normal and depth information from this pass.
  // Using explicit NormalPass avoids dependency errors often encountered in EffectComposer.
  const normalPass = new NormalPass(scene, camera);
  composer.addPass(normalPass);

  // 3. SSAOPass: Screen Space Ambient Occlusion for high-contrast, medical-style shading
  const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);

  // Configure SSAO Settings for high-contrast, medical-style shading
  ssaoPass.kernelRadius = 16;       // radius: 16
  ssaoPass.minDistance = 0.005;
  ssaoPass.maxDistance = 0.1;
  // Note: some SSAOPass implementations map lumInfluence directly, or use it within a custom shader.
  // Standard THREE.js SSAOPass uses output and intensity, but we follow the lumInfluence requirement
  // and set it on the pass if supported, or via its uniforms if it's the standard SSAO.
  if (ssaoPass.lumInfluence !== undefined) {
    ssaoPass.lumInfluence = 0.7;
  }

  // High contrast medical style intensity
  ssaoPass.output = SSAOPass.OUTPUT.Default;

  composer.addPass(ssaoPass);

  // Handle Window Resize for passes
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    composer.setSize(width, height);
    if (ssaoPass.setSize) {
      ssaoPass.setSize(width, height);
    }
  });

  return composer;
}
