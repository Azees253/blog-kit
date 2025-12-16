---
title: Installation
description: How to install Blog Kit packages
date: 2024-01-02
---

## Installation

Get started with Blog Kit by installing the packages you need. Choose between the core package for
markdown parsing utilities or the React package for pre-built UI components. Both packages are
available on npm and support all major package managers.

### Core Package

```bash
npm install @haroonwaves/blog-kit-core
# or
pnpm add @haroonwaves/blog-kit-core
# or
yarn add @haroonwaves/blog-kit-core
```

### React Package

```bash
npm install @haroonwaves/blog-kit-react
# or
pnpm add @haroonwaves/blog-kit-react
# or
yarn add @haroonwaves/blog-kit-react
```

**Note:** The React package requires React 19+ as a peer dependency.

### Styling

The package also includes Prism.js CSS for syntax highlighting and Tailwind CSS for component
styling. Import it in your app:

```tsx
import '@haroonwaves/blog-kit-react/dist/index.css'; // For Prism styles
import '@haroonwaves/blog-kit-react/dist/style.css'; // For Component styles
```

Or if you're using a bundler that supports CSS imports (like Vite), it will be included
automatically. Next.js doesn't support auto CSS imports.
