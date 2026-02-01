# WebExDX Taskify MFE

An Angular-based Micro-Frontend (MFE) for task management within the WebExDX platform.

## Features

- **Task Management**: user-friendly interface for tracking tasks.
- **Modern Angular**: built with Angular 20 and modern control flow.
- **Premium Aesthetics**: using Spartan UI for high-quality components.
- **Styling**: powered by Tailwind CSS 4.

## Tech Stack

- **Framework**: Angular 20
- **UI**: Spartan UI (@spartan-ng/brain)
- **Styling**: Tailwind CSS 4
- **Icons**: Ng-Icons (Lucide)
- **Linter**: Biome

## Prerequisites

- **Node.js**: >= 22
- **Package Manager**: pnpm

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm run start
```

### Build

```bash
pnpm run build:prod
```

## Available Scripts

- `pnpm run start`: Starts the dev server on port 4001.
- `pnpm run build:prod`: Compiles for production.
- `pnpm run lint`: Biome lint check.
- `pnpm run fix`: Biome lint fix.

## Docker

### Build

```bash
docker build -t webexdx-taskify-mfe --build-arg ENVIRONMENT=prod .
```

### Run

```bash
docker run -p 8082:80 webexdx-taskify-mfe
```

The application will be available at `http://localhost:8082`.

## License

Private
