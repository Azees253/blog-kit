import React from 'react';
import type { BlogMeta } from '../types';
import { Badge } from './Badge';

export interface BlogCardProps {
	metadata: BlogMeta;
	basePath?: string; // e.g., '/blog'
	renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
	className?: string;
	showCategory?: boolean;
	showReadingTime?: boolean;
	showDate?: boolean;
}

export function BlogCard({
	metadata,
	basePath = '/blog',
	renderLink,
	className = '',
	showCategory = true,
	showReadingTime = true,
	showDate = true,
}: BlogCardProps) {
	const href = `${basePath}/${metadata.slug}`;
	const defaultLink = (href: string, children: React.ReactNode) => <a href={href}>{children}</a>;
	const Link = renderLink || defaultLink;

	return (
		<article
			className={`rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 p-6 transition-colors ${className}`}
		>
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-3">
					{showCategory && metadata.category && <Badge>{metadata.category}</Badge>}
					{(showReadingTime || showDate) && (
						<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
							{showReadingTime && <span>{metadata.readingTime}</span>}
							{showReadingTime && showDate && <span>•</span>}
							{showDate && (
								<time dateTime={metadata.date}>
									{new Date(metadata.date).toLocaleDateString('en-US', {
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
				<h2 className="font-semibold text-xl text-gray-700 dark:text-gray-100 mb-2 hover:underline transition-colors">
					{metadata.title}
				</h2>
			)}

			<p className="text-sm text-gray-500 dark:text-gray-300 leading-6 mb-4">{metadata.description}</p>

			{Link(
				href,
				<span className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
					Read more →
				</span>
			)}
		</article>
	);
}
