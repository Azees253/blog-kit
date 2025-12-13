import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeRaw from 'rehype-raw';
import type { BlogMeta } from '../types';

import '../prism.css';
import { Badge } from './Badge';

export interface BlogRendererProps {
	content: string;
	metadata: BlogMeta;
	className?: string;
	components?: Record<string, React.ComponentType<any>>;
	showCategory?: boolean;
	showReadingTime?: boolean;
	showDate?: boolean;
}

export function BlogRenderer({
	content,
	metadata,
	className = '',
	components,
	showCategory = true,
	showReadingTime = true,
	showDate = true,
}: BlogRendererProps) {
	const defaultComponents = {
		h1: ({ ...props }: any) => (
			<h1
				className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 mt-8 text-gray-800 dark:text-gray-100"
				{...props}
			/>
		),
		h2: ({ ...props }: any) => (
			<h2
				className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 mt-6 text-gray-800 dark:text-gray-100"
				{...props}
			/>
		),
		h3: ({ ...props }: any) => (
			<h3
				className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-100"
				{...props}
			/>
		),
		h4: ({ ...props }: any) => (
			<h4 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-100" {...props} />
		),
		h5: ({ ...props }: any) => (
			<h5 className="text-lg font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-100" {...props} />
		),
		h6: ({ ...props }: any) => (
			<h6
				className="text-base font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-100"
				{...props}
			/>
		),
		p: ({ ...props }: any) => (
			<p className="mb-4 leading-7 text-gray-600 dark:text-gray-300" {...props} />
		),
		ul: ({ ...props }: any) => (
			<ul className="mb-4 ml-6 list-disc text-gray-600 dark:text-gray-300" {...props} />
		),
		ol: ({ ...props }: any) => (
			<ol className="mb-4 ml-6 list-decimal text-gray-600 dark:text-gray-300" {...props} />
		),
		li: ({ ...props }: any) => <li className="mb-2" {...props} />,
		code: ({ className: codeClassName, children, ...props }: any) => {
			const isInline = !codeClassName;
			return isInline ? (
				<code
					className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm text-red-600 dark:text-red-400"
					{...props}
				>
					{children}
				</code>
			) : (
				<code className={codeClassName as string} {...props}>
					{children}
				</code>
			);
		},
		pre: ({ className: preClassName, children, ...props }: any) => {
			return (
				<pre
					className={`mb-4 rounded-lg overflow-x-auto [&>code]:block [&>code]:p-4 ${
						preClassName || ''
					}`}
					{...props}
				>
					{children}
				</pre>
			);
		},
		blockquote: ({ ...props }: any) => (
			<blockquote
				className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic my-4 text-gray-600 dark:text-gray-400"
				{...props}
			/>
		),
		a: ({ ...props }: any) => (
			<a
				className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
				{...props}
			/>
		),
		strong: ({ ...props }: any) => (
			<strong className="font-semibold text-gray-800 dark:text-gray-100" {...props} />
		),
		em: ({ ...props }: any) => <em className="italic" {...props} />,
		del: ({ ...props }: any) => (
			<del className="line-through text-gray-500 dark:text-gray-400" {...props} />
		),
		hr: ({ ...props }: any) => (
			<hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />
		),
		br: ({ ...props }: any) => <br {...props} />,
		img: ({ ...props }: any) => <img className="max-w-full h-auto rounded-lg my-4" {...props} />,
		table: ({ ...props }: any) => (
			<div className="overflow-x-auto my-4">
				<table
					className="min-w-full border border-gray-300 dark:border-gray-700 rounded"
					{...props}
				/>
			</div>
		),
		thead: ({ ...props }: any) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
		tbody: ({ ...props }: any) => <tbody {...props} />,
		tr: ({ ...props }: any) => (
			<tr className="border-b border-gray-300 dark:border-gray-700" {...props} />
		),
		th: ({ ...props }: any) => (
			<th
				className="px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700 dark:text-gray-100"
				{...props}
			/>
		),
		td: ({ ...props }: any) => (
			<td
				className="px-4 py-2 border border-gray-300 dark:border-gray-700 dark:text-gray-300"
				{...props}
			/>
		),
		input: ({ ...props }: any) => <input className="mr-2" type="checkbox" disabled {...props} />,
	};

	const mergedComponents = { ...defaultComponents, ...components };

	return (
		<>
			{showCategory ||
				showReadingTime ||
				(showDate && (
					<div className="flex items-center gap-3 mb-4">
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
				))}

			<div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeRaw, rehypePrismPlus]}
					components={mergedComponents}
				>
					{content}
				</ReactMarkdown>
			</div>
		</>
	);
}
