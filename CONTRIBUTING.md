# Contributing to Solaris

Thank you for considering contributing to Solaris — an interactive 3D Solar System visualization.

## Getting Started

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/solar-visualize.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## Development

### Project Structure

```
src/
  components/   UI components (React)
  scenes/       Three.js 3D scene manager
  data/         Planet datasets and mission info
  styles/       Global CSS with glassmorphism design
  types/        Shared TypeScript types
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |

### Code Style

- TypeScript strict mode is enabled.
- Run `npx tsc --noEmit` to type-check before committing.
- Follow existing patterns for components and scene objects.
- No unused variables or imports — the build will fail.

## Adding a Planet or Moon

Add entries to `src/data/planets.ts`. Each planet needs:

- Scientific data (diameter, mass, gravity, temperature, etc.)
- Visual properties (color, radius, orbit radius, speeds, tilt)
- Optional: ring data and moon list

## Making a Pull Request

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes with a clear message.
3. Push and open a pull request.

## Reporting Issues

Open an issue with a clear title, steps to reproduce, and expected vs actual behavior.
