# Publishing to npm

This project is set up to automatically publish packages to npm when changes are merged to the
`main` branch.

## Setup

### 1. Create an npm Access Token

1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Click on your profile picture → **Access Tokens**
3. Click **Generate New Token** → **Automation** (or **Classic Token** with **Automation** type)
4. Copy the token (you won't be able to see it again)

### 2. Add the Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

## How It Works

- The GitHub Actions workflow (`.github/workflows/publish.yml`) automatically runs on:
  - Push to `main` branch
  - Manual trigger via GitHub Actions UI (workflow_dispatch)

- The workflow will:
  1. Checkout the code
  2. Setup Node.js and pnpm
  3. Install dependencies
  4. Build all packages
  5. Publish changed packages to npm

## Manual Publishing

To manually publish packages locally:

```bash
pnpm publish:packages
```

Or publish a specific package:

```bash
cd packages/markdown-kit-core
pnpm publish --access public
```

## Version Management

**Important**: Before merging to main, make sure to update the version numbers in the package.json
files of packages you want to publish:

- `packages/markdown-kit-core/package.json`
- `packages/markdown-kit-react/package.json`

The workflow will publish packages as-is with their current version numbers. If a version already
exists on npm, the publish will fail.

## Notes

- Packages are published with `--access public` flag (required for scoped packages like
  `@yourname/*`)
- The workflow uses `--no-git-checks` to avoid git-related errors during CI
- Make sure your package names in package.json match your npm organization/username
