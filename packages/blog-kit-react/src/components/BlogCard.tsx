import React from 'react';
import type { BlogMeta } from '../types';
import { Badge } from './Badge';

export interface BlogCardProps {
	blog: BlogMeta;
	basePath?: string; // e.g., '/blog'
	renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
	className?: string;
	showCategory?: boolean;
	showReadingTime?: boolean;
	showDate?: boolean;
}

export function BlogCard({
	blog,
	basePath = '/blog',
	renderLink,
	className = '',
	showCategory = true,
	showReadingTime = true,
	showDate = true,
}: BlogCardProps) {
	const href = `${basePath}/${blog.slug}`;
	const defaultLink = (href: string, children: React.ReactNode) => <a href={href}>{children}</a>;
	const Link = renderLink || defaultLink;

	return (
		<article
			className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 p-6 transition-colors ${className}`}
		>
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-3">
					{showCategory && blog.category && <Badge>{blog.category}</Badge>}
					{(showReadingTime || showDate) && (
						<div className="flex items-center gap-2 text-sm text-gray-500">
							{showReadingTime && <span>{blog.readingTime}</span>}
							{showReadingTime && showDate && <span>•</span>}
							{showDate && (
								<time dateTime={blog.date}>
									{new Date(blog.date).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</time>
							)}
						</div>
					)}
				</div>
			</div>

			{Link(
				href,
				<h2 className="font-semibold text-xl text-gray-700 mb-2 hover:underline transition-colors">
					{blog.title}
				</h2>
			)}

			<p className="text-sm text-gray-500 leading-6 mb-4">{blog.description}</p>

			{Link(
				href,
				<span className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
					Read more →
				</span>
			)}
		</article>
	);
}
