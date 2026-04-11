## 2026-03-27 - Extract static Object.values() from Sidebar render
**Learning:** Extracting static computations (like Object.values on a constant) outside of the React component's render function avoids redundant array allocations and reduces garbage collection pressure during re-renders.
**Action:** Always check for static data transformations inside components and lift them to module scope or memoize them if they depend on props/state.
