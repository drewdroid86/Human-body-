import { DISEASES } from './src/data';

const iterations = 1000000;

console.log(`Running baseline benchmark: Object.values(DISEASES) ${iterations} times...`);

const start = performance.now();
for (let i = 0; i < iterations; i++) {
  const values = Object.values(DISEASES);
}
const end = performance.now();

console.log(`Baseline time: ${(end - start).toFixed(4)}ms`);
