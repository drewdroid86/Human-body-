import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

class AnatomyLoader {
  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();

    // Optional: Set draco decoder path if needed
    // this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    // Groups to store sorted meshes
    this.muscleGroup = new THREE.Group();
    this.muscleGroup.name = "muscleGroup";

    this.skeletonGroup = new THREE.Group();
    this.skeletonGroup.name = "skeletonGroup";

    this.skinGroup = new THREE.Group();
    this.skinGroup.name = "skinGroup";

    this.nervousGroup = new THREE.Group();
    this.nervousGroup.name = "nervousGroup";

    // Fallback group
    this.miscGroup = new THREE.Group();
    this.miscGroup.name = "miscGroup";
  }

  /**
   * Loads a GLTF/GLB model asynchronously
   * @param {string} url - URL to the 3D model
   * @returns {Promise<THREE.Group>} - A group containing the sorted meshes
   */
  loadModel(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          console.log('Model loaded successfully. Traversing scene graph...');

          const rootGroup = new THREE.Group();
          rootGroup.add(
            this.muscleGroup,
            this.skeletonGroup,
            this.skinGroup,
            this.nervousGroup,
            this.miscGroup
          );

          // Need to clone children array because altering scene graph while iterating changes indices
          const children = [...gltf.scene.children];

          gltf.scene.traverse((node) => {
            if (node.isMesh) {
              const name = node.name.toLowerCase();
              console.log(`Found mesh: ${node.name}`);

              // Sort based on naming conventions
              if (name.includes('muscle')) {
                this.muscleGroup.add(node);
              } else if (name.includes('bone') || name.includes('skeleton')) {
                this.skeletonGroup.add(node);
              } else if (name.includes('skin')) {
                this.skinGroup.add(node);
              } else if (name.includes('nerve') || name.includes('nervous')) {
                this.nervousGroup.add(node);
              } else {
                this.miscGroup.add(node);
              }
            }
          });

          console.log(`Sorting complete.
            Muscles: ${this.muscleGroup.children.length}
            Bones: ${this.skeletonGroup.children.length}
            Skin: ${this.skinGroup.children.length}
            Nerves: ${this.nervousGroup.children.length}
            Misc: ${this.miscGroup.children.length}
          `);

          resolve(rootGroup);
        },
        (progress) => {
          console.log(`Loading model... ${(progress.loaded / progress.total) * 100}%`);
        },
        (error) => {
          console.error('An error occurred loading the anatomy model.', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Modifies the material of the Skin group to specific opacity
   * @param {number} opacity - Opacity level (0.0 to 1.0), defaults to 0.5
   * @param {boolean} transparent - Whether it should be transparent, defaults to true
   */
  setSkinOpacity(opacity = 0.5, transparent = true) {
    this.skinGroup.traverse((node) => {
      if (node.isMesh && node.material) {
        // Ensure we clone the material so we don't accidentally modify shared materials incorrectly
        if (!node.material.isCloned) {
          node.material = node.material.clone();
          node.material.isCloned = true;
        }
        node.material.transparent = transparent;
        node.material.opacity = opacity;
        node.material.needsUpdate = true;
      }
    });
    console.log(`Skin material updated: opacity=${opacity}, transparent=${transparent}`);
  }
}

export default AnatomyLoader;