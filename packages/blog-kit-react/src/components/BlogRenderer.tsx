import React, { type ComponentProps } from 'react';
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

const defaultComponents = {
	h1: (props: ComponentProps<'h1'>) => (
		<h1
			className="mt-10 first:mt-0 mb-5 text-3xl md:text-4xl font-semibold tracking-tight text-gray-800 dark:text-gray-200"
			{...props}
		/>
	),

	h2: (props: ComponentProps<'h2'>) => (
		<h2
			className="mt-8 first:mt-0 mb-4 text-2xl md:text-3xl font-semibold tracking-tight text-gray-800 dark:text-gray-200"
			{...props}
		/>
	),

	h3: (props: ComponentProps<'h3'>) => (
		<h3
			className="mt-6 mb-4 first:mt-0 text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200"
			{...props}
		/>
	),

	h4: (props: ComponentProps<'h4'>) => (
		<h4
			className="mt-5 mb-3 first:mt-0 text-lg font-semibold text-gray-800 dark:text-gray-200"
			{...props}
		/>
	),

	h5: (props: ComponentProps<'h5'>) => (
		<h5
			className="mt-4 mb-2 first:mt-0 text-base font-semibold text-gray-700 dark:text-gray-200"
			{...props}
		/>
	),

	h6: (props: ComponentProps<'h6'>) => (
		<h6
			className="mt-4 mb-2 text-sm first:mt-0 font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300"
			{...props}
		/>
	),

	p: (props: ComponentProps<'p'>) => (
		<p className="mb-4 leading-7 text-gray-700 dark:text-gray-300" {...props} />
	),

	ul: (props: ComponentProps<'ul'>) => (
		<ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300" {...props} />
	),

	ol: (props: ComponentProps<'ol'>) => (
		<ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300" {...props} />
	),

	li: (props: ComponentProps<'li'>) => <li {...props} />,

	code: ({ className, children, ...props }: ComponentProps<'code'>) => {
		const isInline = !className;
		return isInline ? (
			<code
				className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-rose-600 dark:text-rose-400"
				{...props}
			>
				{children}
			</code>
		) : (
			<code className={className} {...props}>
				{children}
			</code>
		);
	},

	pre: ({ className: preClassName, children, ...props }: ComponentProps<'pre'>) => {
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

	blockquote: (props: ComponentProps<'blockquote'>) => (
		<blockquote
			className="my-6 border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400"
			{...props}
		/>
	),

	a: (props: ComponentProps<'a'>) => (
		<a
			className="text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-800 dark:hover:text-blue-300"
			{...props}
		/>
	),

	strong: (props: ComponentProps<'strong'>) => (
		<strong className="font-semibold text-gray-800 dark:text-gray-200" {...props} />
	),

	em: (props: ComponentProps<'em'>) => (
		<em className="italic text-gray-800 dark:text-gray-200" {...props} />
	),

	del: (props: ComponentProps<'del'>) => (
		<del className="text-gray-500 dark:text-gray-400" {...props} />
	),

	hr: (props: ComponentProps<'hr'>) => (
		<hr className="my-9 border-gray-200 dark:border-neutral-900" {...props} />
	),

	br: (props: ComponentProps<'br'>) => <br {...props} />,

	img: (props: ComponentProps<'img'>) => (
		<img className="my-6 rounded-xl max-w-full h-auto" {...props} />
	),

	table: (props: ComponentProps<'table'>) => (
		<div className="my-6 overflow-x-auto">
			<table
				className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm"
				{...props}
			/>
		</div>
	),

	thead: (props: ComponentProps<'thead'>) => (
		<thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" {...props} />
	),

	tbody: (props: ComponentProps<'tbody'>) => <tbody {...props} />,

	tr: (props: ComponentProps<'tr'>) => (
		<tr className="border-b last:border-b-0 border-gray-200 dark:border-gray-700" {...props} />
	),

	th: (props: ComponentProps<'th'>) => (
		<th className="px-4 py-3 text-left font-semibold" {...props} />
	),

	td: (props: ComponentProps<'td'>) => (
		<td className="px-4 py-3 text-gray-700 dark:text-gray-300" {...props} />
	),

	input: (props: ComponentProps<'input'>) => (
		<input type="checkbox" disabled className="mr-2 accent-blue-600" {...props} />
	),
};

export function BlogRenderer({
	content,
	metadata,
	className = '',
	components,
	showCategory = true,
	showReadingTime = true,
	showDate = true,
}: BlogRendererProps) {
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
