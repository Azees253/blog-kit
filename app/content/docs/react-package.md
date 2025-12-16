---
title: React Package
description: React components and hooks for rendering blogs
date: 2024-01-05
---

## React Package

The `@haroonwaves/blog-kit-react` package offers a collection of production-ready React components
and hooks for building beautiful blog interfaces. From markdown rendering with syntax highlighting
to search functionality, these components are designed to work seamlessly with any React framework.

### BlogRenderer

Render markdown content with syntax highlighting and beautiful styling:

```tsx
import { BlogRenderer } from '@haroonwaves/blog-kit-react';

function BlogPost({ content }) {
	return <BlogRenderer content={content} metadata={metadata} />;
}
```

#### Customizing Components

You can override any default component by passing custom components through the `components` prop:

```tsx
import { BlogRenderer } from '@haroonwaves/blog-kit-react';
import type { ComponentProps } from 'react';

function BlogPost({ content, metadata }) {
	// Custom component overrides
	const customComponents = {
		// Custom blockquote with a different style
		blockquote: (props: ComponentProps<'blockquote'>) => (
			<blockquote
				className="my-6 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950 p-4 rounded-r-lg italic"
				{...props}
			/>
		),
	};

	return <BlogRenderer content={content} metadata={metadata} components={customComponents} />;
}
```

**Props:**

- `content` (string, required): Blog content to render
- `metadata` (BlogMeta, required): Blog meta info to render
- `className` (string, optional): Additional CSS classes
- `components` (object, optional): Custom component overrides
- `showCategory` (boolean, optional): Show category badge (default: true)
- `showReadingTime` (boolean, optional): Show reading time (default: true)
- `showDate` (boolean, optional): Show publication date (default: true)

### BlogCard

Display a single blog post card:

```tsx
import { BlogCard } from '@haroonwaves/blog-kit-react';

function BlogCardExample({ blogMeta }) {
	return <BlogCard metadata={blogMeta} basePath="/blog" />;
}
```

**Props:**

- `metadata` (BlogMeta, required): Blog metadata object
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

function BlogListExample({ blogsMeta }) {
	return <BlogList metadata={blogsMeta} basePath="/blog" emptyMessage="No posts found." />;
}
```

**Props:**

- `metadata` (BlogMeta[], required): Array of blog metadata
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

function BlogSearch({ blogsMeta }) {
	const { metadata, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories } =
		useBlogs(blogsMeta);

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
			<BlogList metadata={metadata} />
		</div>
	);
}
```

**Returns:**

- `metadata` (BlogMeta[]): Filtered blog posts metadata
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
	const blogsMeta = getAllBlogsMeta({
		contentDirectory: process.cwd(),
		blogSubdirectory: 'content/blog',
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<h1 className="text-4xl font-bold mb-4">Blogs</h1>
				<BlogList
					metadata={blogsMeta}
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
import { BlogRenderer } from '@haroonwaves/blog-kit-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

const blogConfig = {
	contentDirectory: process.cwd(),
	blogSubdirectory: 'content/blog',
};

export function generateStaticParams() {
	const blogsMeta = getAllBlogsMeta(blogConfig);
	return blogsMeta.map((meta) => ({
		slug: meta.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;

	const blog = getBlog(slug, blogConfig);

	if (!blog) {
		return {
			title: 'Blog Post Not Found',
		};
	}

	return {
		title: `${blog.metadata.title} | Blog Kit`,
		description: blog.metadata.description,
		openGraph: {
			title: blog.metadata.title,
			description: blog.metadata.description,
			type: 'article',
			publishedTime: blog.metadata.date,
		},
	};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	const blog = getBlog(slug, blogConfig);

	if (!blog) notFound();

	const { metadata, content } = blog;

	return (
		<article>
			<BlogRenderer content={content} metadata={metadata} />
		</article>
	);
}
```

### Next.js SSR Example (Server-Side Rendering)

For server-side rendering, use the same functions but without `generateStaticParams`:

```tsx
// app/blog/[slug]/page.tsx
import { getBlog } from '@haroonwaves/blog-kit-core';
import { BlogRenderer } from '@haroonwaves/blog-kit-react';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	const blog = getBlog(slug, {
		contentDirectory: process.cwd(),
		blogSubdirectory: 'content/blog',
	});

	if (!blog) notFound();

	return (
		<article>
			<BlogRenderer content={blog.content} metadata={blog.metadata} />
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
import { BlogRenderer, BlogList, useBlogs } from '@haroonwaves/blog-kit-react';

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
	const [blogsMeta, setBlogsMeta] = useState<BlogMeta[]>([]);
	const { metadata, searchTerm, setSearchTerm } = useBlogs(blogsMeta);

	useEffect(() => {
		fetchAllBlogs().then(setBlogsMeta);
	}, []);

	return (
		<div>
			<input
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Search..."
			/>
			<BlogList metadata={metadata} basePath="/blog" />
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
			<BlogRenderer content={blog.content} metadata={blog.metadata} />
		</article>
	);
}
```
