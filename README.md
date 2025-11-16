# Blog Kit

A powerful toolkit for building blog systems with markdown. Consists of two packages: a core library
for parsing markdown blog files and a React component library for rendering blog UIs.

## Table of Contents

- [Packages](#packages)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Package](#core-package)
- [React Package](#react-package)
- [API Reference](#api-reference)
- [Features](#features)
- [Styling](#styling)
- [Development](#development)
- [License](#license)
- [Contributing](#contributing)

## Packages

- **[@haroonwaves/blog-kit-core](./packages/blog-kit-core)** - Core utilities for parsing markdown
  blog files with frontmatter
- **[@haroonwaves/blog-kit-react](./packages/blog-kit-react)** - React components and hooks for
  rendering blogs

## Installation

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

**Note:** The React package requires React 18+ as a peer dependency.

## Quick Start

### Next.js SSG (Recommended)

The easiest way to get started is with Next.js using Static Site Generation (SSG):

```tsx
// app/blog/page.tsx
import { getAllBlogsMeta } from '@haroonwaves/blog-kit-core';
import { BlogList } from '@haroonwaves/blog-kit-react';
import Link from 'next/link';

export default function BlogPage() {
	const blogs = getAllBlogsMeta({
		contentDirectory: process.cwd(),
		blogSubdirectory: 'content/blog',
	});

	return (
		<BlogList
			blogs={blogs}
			basePath="/blog"
			renderLink={(href, children) => <Link href={href}>{children}</Link>}
		/>
	);
}
```

```tsx
// app/blog/[slug]/page.tsx
import { getAllBlogsMeta, getBlog } from '@haroonwaves/blog-kit-core';
import { MarkdownRenderer } from '@haroonwaves/blog-kit-react';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
	const blogs = getAllBlogsMeta({
		contentDirectory: process.cwd(),
		blogSubdirectory: 'content/blog',
	});
	return blogs.map((blog) => ({ slug: blog.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
	const blog = getBlog(params.slug, {
		contentDirectory: process.cwd(),
		blogSubdirectory: 'content/blog',
	});

	if (!blog) notFound();

	return (
		<article>
			<h1>{blog.metadata.title}</h1>
			<MarkdownRenderer content={blog.content} />
		</article>
	);
}
```

For more examples, see [Next.js SSG Example](#nextjs-ssg-example-static-site-generation),
[Next.js SSR Example](#nextjs-ssr-example-server-side-rendering), or
[Pure React Example](#pure-react-example-client-side).

## Core Package

The core package provides utilities to parse markdown blog files with frontmatter and calculate
reading time.

### Basic Usage

#### Server-Side (SSR/SSG)

For server-side rendering (Next.js, Node.js scripts, etc.):

```typescript
import { getAllBlogsMeta, getBlog } from '@haroonwaves/blog-kit-core';

const config = {
	contentDirectory: './content',
	blogSubdirectory: 'blog', // optional, defaults to 'blog'
};

// Get all blog metadata
const blogs = getAllBlogsMeta(config);

// Get a specific blog post
const blog = getBlog('my-blog-post', config);
```

#### Client-Side

For client-side usage (when you have markdown content as strings):

```typescript
import { extractBlogMeta, extractBlog } from '@haroonwaves/blog-kit-core';

// Extract metadata from markdown content
const blogMeta = extractBlogMeta(markdownContent, 'my-blog-post');

// Extract full blog data from markdown content
const blog = extractBlog(markdownContent, 'my-blog-post');
```

### Blog File Format

Your markdown files should include frontmatter:

```markdown
---
title: My Blog Post
description: A brief description of the post
date: 2024-01-15
category: Technology
---

# My Blog Post

Your markdown content here...
```

**Required frontmatter fields:**

- `title` (string): The blog post title
- `description` (string): A brief description/summary
- `date` (string): Publication date (ISO format recommended: YYYY-MM-DD)

**Optional frontmatter fields:**

- `category` (string): Category/tag for the post

The parser automatically extracts this frontmatter and calculates reading time based on the content
length.

## React Package

The React package provides beautiful, customizable components for rendering blogs in your React
applications.

### MarkdownRenderer

Render markdown content with syntax highlighting and beautiful styling:

```tsx
import { MarkdownRenderer } from '@haroonwaves/blog-kit-react';

function BlogPost({ content }) {
	return <MarkdownRenderer content={content} />;
}
```

**Props:**

- `content` (string, required): Markdown content to render
- `className` (string, optional): Additional CSS classes
- `components` (object, optional): Custom component overrides

### BlogCard

Display a single blog post card:

```tsx
import { BlogCard } from '@haroonwaves/blog-kit-react';

function BlogCardExample({ blog }) {
	return (
		<BlogCard
			blog={blog}
			basePath="/blog"
			showCategory={true}
			showReadingTime={true}
			showDate={true}
		/>
	);
}
```

**Props:**

- `blog` (BlogMeta, required): Blog metadata object
- `basePath` (string, optional): Base path for blog links (default: '/blog')
- `renderLink` (function, optional): Custom link renderer (useful for Next.js Link)
- `className` (string, optional): Additional CSS classes
- `showCategory` (boolean, optional): Show category badge (default: true)
- `showReadingTime` (boolean, optional): Show reading time (default: true)
- `showDate` (boolean, optional): Show publication date (default: true)

### BlogList

Display a list of blog posts:

```tsx
import { BlogList } from '@haroonwaves/blog-kit-react';

function BlogListExample({ blogs }) {
	return <BlogList blogs={blogs} basePath="/blog" emptyMessage="No posts found." />;
}
```

**Props:**

- `blogs` (BlogMeta[], required): Array of blog metadata
- `basePath` (string, optional): Base path for blog links (default: '/blog')
- `renderLink` (function, optional): Custom link renderer
- `className` (string, optional): Additional CSS classes
- `emptyMessage` (string, optional): Message when no blogs (default: 'No blog posts found.')
- `cardProps` (object, optional): Props to pass to each BlogCard

### BlogPlaceholder

Show loading placeholders while blogs are loading:

```tsx
import { BlogPlaceholder } from '@haroonwaves/blog-kit-react';

function LoadingBlogs() {
	return <BlogPlaceholder count={3} />;
}
```

**Props:**

- `count` (number, optional): Number of placeholder cards (default: 3)
- `className` (string, optional): Additional CSS classes

### useBlogs Hook

Filter and search through blog posts:

```tsx
import { useBlogs } from '@haroonwaves/blog-kit-react';

function BlogSearch({ blogs }) {
	const {
		blogs: filteredBlogs,
		searchTerm,
		setSearchTerm,
		selectedCategory,
		setSelectedCategory,
		categories,
	} = useBlogs(blogs);

	return (
		<div>
			<input
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Search blogs..."
			/>
			<select
				value={selectedCategory || ''}
				onChange={(e) => setSelectedCategory(e.target.value || null)}
			>
				<option value="">All Categories</option>
				{categories.map((cat) => (
					<option key={cat} value={cat}>
						{cat}
					</option>
				))}
			</select>
			<BlogList blogs={filteredBlogs} />
		</div>
	);
}
```

**Returns:**

- `blogs` (BlogMeta[]): Filtered blog posts
- `searchTerm` (string): Current search term
- `setSearchTerm` (function): Update search term
- `selectedCategory` (string | null): Selected category filter
- `setSelectedCategory` (function): Update category filter
- `categories` (string[]): Available categories from blogs

### Next.js Integration

For Next.js projects, use a custom link renderer:

```tsx
import Link from 'next/link';
import { BlogCard } from '@haroonwaves/blog-kit-react';

function NextBlogCard({ blog }) {
	return (
		<BlogCard
			blog={blog}
			basePath="/blog"
			renderLink={(href, children) => <Link href={href}>{children}</Link>}
		/>
	);
}
```

### Next.js SSG Example (Static Site Generation)

For Next.js with static site generation, use server components and `generateStaticParams`:

**Blog List Page** (`app/blog/page.tsx`):

```tsx
import { getAllBlogsMeta } from '@haroonwaves/blog-kit-core';
import { BlogList } from '@haroonwaves/blog-kit-react';
import Link from 'next/link';

export default function BlogListPage() {
	const blogs = getAllBlogsMeta({
		contentDirectory: process.cwd(),
		blogSubdirectory: 'content/blog',
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<h1 className="text-4xl font-bold mb-4">Blogs</h1>
				<BlogList
					blogs={blogs}
					basePath="/blog"
					renderLink={(href, children) => <Link href={href}>{children}</Link>}
				/>
			</div>
		</div>
	);
}
```

**Blog Post Page** (`app/blog/[slug]/page.tsx`):

```tsx
import { getAllBlogsMeta, getBlog } from '@haroonwaves/blog-kit-core';
import { MarkdownRenderer } from '@haroonwaves/blog-kit-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

const blogConfig = {
	contentDirectory: process.cwd(),
	blogSubdirectory: 'content/blog',
};

export async function generateStaticParams() {
	const blogs = getAllBlogsMeta(blogConfig);
	return blogs.map((blog) => ({
		slug: blog.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const blog = getBlog(params.slug, blogConfig);

	if (!blog) {
		return {
			title: 'Blog Post Not Found',
		};
	}

	return {
		title: blog.metadata.title,
		description: blog.metadata.description,
		openGraph: {
			title: blog.metadata.title,
			description: blog.metadata.description,
			type: 'article',
			publishedTime: blog.metadata.date,
		},
	};
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
	const blog = getBlog(params.slug, blogConfig);

	if (!blog) notFound();

	const { metadata, content } = blog;

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<Link
					href="/blog"
					className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
				>
					← Back to blog
				</Link>

				<article className="bg-white rounded-lg border border-gray-200 p-8">
					<h1 className="text-4xl font-bold mb-4">{metadata.title}</h1>
					<div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
						{metadata.category && (
							<span className="px-2 py-1 bg-orange-100 text-orange-500 rounded">
								{metadata.category}
							</span>
						)}
						<span>{blog.readingTime}</span>
						<span>•</span>
						<time dateTime={metadata.date}>{new Date(metadata.date).toLocaleDateString()}</time>
					</div>
					<MarkdownRenderer content={content} />
				</article>
			</div>
		</div>
	);
}
```

### Next.js SSR Example (Server-Side Rendering)

For server-side rendering, use the same functions but without `generateStaticParams`:

```tsx
// app/blog/[slug]/page.tsx
import { getBlog } from '@haroonwaves/blog-kit-core';
import { MarkdownRenderer } from '@haroonwaves/blog-kit-react';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
	const blog = getBlog(params.slug, {
		contentDirectory: process.cwd(),
		blogSubdirectory: 'content/blog',
	});

	if (!blog) notFound();

	return (
		<article>
			<h1>{blog.metadata.title}</h1>
			<MarkdownRenderer content={blog.content} />
		</article>
	);
}
```

**Note:** SSG is recommended for blogs as it pre-renders pages at build time for better performance.

### Pure React Example (Client-Side)

For pure React applications (Create React App, Vite, etc.), use the client-side functions with
markdown content fetched from an API or imported:

```tsx
import { useState, useEffect } from 'react';
import { extractBlogMeta, extractBlog, type BlogMeta, type Blog } from '@haroonwaves/blog-kit-core';
import { MarkdownRenderer, BlogList, useBlogs } from '@haroonwaves/blog-kit-react';

// Example: Fetch markdown content from an API
async function fetchBlogContent(slug: string): Promise<string> {
	const response = await fetch(`/api/blogs/${slug}`);
	return response.text();
}

async function fetchAllBlogs(): Promise<BlogMeta[]> {
	const response = await fetch('/api/blogs');
	const blogs = await response.json();
	// If you receive raw markdown, extract metadata
	return blogs.map((blog: { content: string; slug: string }) =>
		extractBlogMeta(blog.content, blog.slug)
	);
}

function BlogPage() {
	const [blogs, setBlogs] = useState<BlogMeta[]>([]);
	const { blogs: filteredBlogs, searchTerm, setSearchTerm } = useBlogs(blogs);

	useEffect(() => {
		fetchAllBlogs().then(setBlogs);
	}, []);

	return (
		<div>
			<input
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Search..."
			/>
			<BlogList blogs={filteredBlogs} basePath="/blog" />
		</div>
	);
}

function BlogPostPage({ slug }: { slug: string }) {
	const [blog, setBlog] = useState<Blog | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchBlogContent(slug).then((content) => {
			const blogData = extractBlog(content, slug);
			setBlog(blogData);
			setLoading(false);
		});
	}, [slug]);

	if (loading) return <div>Loading...</div>;
	if (!blog) return <div>Blog not found</div>;

	return (
		<article>
			<h1>{blog.metadata.title}</h1>
			<p>{blog.metadata.description}</p>
			<MarkdownRenderer content={blog.content} />
		</article>
	);
}
```

## API Reference

### Core Package

#### Server-Side Functions (SSR/SSG only)

##### `getAllBlogsMeta(config: BlogConfig): BlogMeta[]`

Returns an array of all blog metadata sorted by date (newest first). Requires Node.js `fs` module.

**Parameters:**

- `config.contentDirectory` (string): Path to your content directory
- `config.blogSubdirectory` (string, optional): Subdirectory for blog files (defaults to 'blog')

**Returns:** Array of `BlogMeta` objects

**Example:**

```typescript
const blogs = getAllBlogsMeta({
	contentDirectory: './content',
	blogSubdirectory: 'posts', // optional
});

// blogs is an array of BlogMeta objects
blogs.forEach((blog) => {
	console.log(blog.title, blog.slug, blog.readingTime);
});
```

##### `getBlog(slug: string, config: BlogConfig): Blog | null`

Returns the full blog data including content for a specific slug. Requires Node.js `fs` module.

**Parameters:**

- `slug` (string): The blog post slug (filename without .md)
- `config.contentDirectory` (string): Path to your content directory
- `config.blogSubdirectory` (string, optional): Subdirectory for blog files (defaults to 'blog')

**Returns:** `Blog` object or `null` if not found

**Example:**

```typescript
const blog = getBlog('my-blog-post', {
	contentDirectory: './content',
});

if (blog) {
	console.log(blog.metadata.title);
	console.log(blog.content); // markdown content
	console.log(blog.readingTime);
}
```

#### Client-Side Functions (Browser compatible)

##### `extractBlogMeta(content: string, slug: string): BlogMeta`

Extracts blog metadata from raw markdown content. Works in browser environments.

**Parameters:**

- `content` (string): Raw markdown content string
- `slug` (string): Blog post slug/identifier

**Returns:** `BlogMeta` object

**Example:**

```typescript
const blogMeta = extractBlogMeta(markdownContent, 'my-blog-post');
console.log(blogMeta.title, blogMeta.readingTime);
```

##### `extractBlog(content: string, slug: string): Blog`

Extracts full blog data from raw markdown content. Works in browser environments.

**Parameters:**

- `content` (string): Raw markdown content string
- `slug` (string): Blog post slug/identifier

**Returns:** `Blog` object

**Example:**

```typescript
const blog = extractBlog(markdownContent, 'my-blog-post');
console.log(blog.metadata.title);
console.log(blog.content); // markdown content
```

### React Package

#### Components

- `MarkdownRenderer` - Renders markdown content with syntax highlighting
- `BlogCard` - Single blog post card component
- `BlogList` - List of blog cards
- `BlogPlaceholder` - Loading placeholder component

#### Hooks

- `useBlogs(blogs: BlogMeta[])` - Provides search and filter functionality

See the [React Package](#react-package) section for detailed examples of each component and hook.

### Types

```typescript
interface BlogMeta {
	title: string;
	description: string;
	date: string;
	category?: string;
	slug: string;
	readingTime: string;
}

interface Blog {
	metadata: BlogMeta;
	content: string;
	readingTime: string;
}

interface BlogConfig {
	contentDirectory: string;
	blogSubdirectory?: string;
}
```

## Features

### Core Package

- ✅ Parse markdown files with frontmatter (using
  [gray-matter](https://github.com/jonschlinkert/gray-matter))
- ✅ Extract blog metadata (title, description, date, category)
- ✅ Calculate reading time automatically (using
  [reading-time](https://github.com/ngryman/reading-time))
- ✅ Sort blogs by date (newest first)
- ✅ TypeScript support with full type definitions
- ✅ Zero dependencies on React or UI frameworks

### React Package

- ✅ Beautiful, customizable markdown rendering
- ✅ Syntax highlighting for code blocks (Prism.js)
- ✅ GitHub Flavored Markdown (GFM) support
- ✅ Responsive blog card components
- ✅ Search and filter functionality via `useBlogs` hook
- ✅ Loading placeholders
- ✅ Customizable styling with Tailwind CSS classes
- ✅ TypeScript support with full type definitions
- ✅ Works with any routing library (Next.js, Remix, etc.)

## Styling

The React components use Tailwind CSS classes. Make sure you have
[Tailwind CSS](https://tailwindcss.com/) configured in your project.

The package also includes Prism.js CSS for syntax highlighting. Import it in your app:

```tsx
import '@haroonwaves/blog-kit-react/dist/index.css';
```

Or if you're using a bundler that supports CSS imports, it will be included automatically.

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

For more information about publishing packages, see [PUBLISHING.md](./PUBLISHING.md).

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
