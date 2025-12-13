# Blog Kit

A powerful toolkit for building blog systems with markdown. Consists of two packages: a core library
for parsing markdown blog files and a React component library for rendering blog UIs.

## Documentation

[blog-kit.pages.dev](https://blog-kit.pages.dev) - A full documentation of Blog Kit built with Blog
Kit.

## Development

This is a monorepo managed with pnpm workspaces.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Format code
pnpm format
```

# Contributing

Fork the Project

## Branching Strategy

- Feature branches: `feature/*`
  ```bash
  git checkout -b feature/YOUR-BRANCH-NAME
  ```
- Bug fix branches: `fix/*`
  ```bash
  git checkout -b fix/YOUR-BRANCH-NAME
  ```

## Commit Message Format

All commits MUST follow this format:

```
<gitmoji> type: subject

[optional body]
```

### Examples

```bash
✨ feat: add dark-mode support
🐛 fix: resolve markdown parsing issue
📝 docs: update react component library documentation
```

## Development Workflow

1. Create your Feature Branch `git checkout -b feature/YOUR-BRANCH-NAME` from the `main` branch
2. Push to the Branch `git push origin feature/YOUR-BRANCH-NAME`
3. Open a Pull Request against the `main` branch

## License

[LICENSE](/LICENSE)
