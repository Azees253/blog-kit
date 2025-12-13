import { BlogCard, type BlogCardProps } from './BlogCard';
import type { BlogMeta } from '../types';

export interface BlogListProps {
	metadata: BlogMeta[];
	basePath?: string;
	renderLink?: BlogCardProps['renderLink'];
	className?: string;
	emptyMessage?: string;
	cardProps?: Omit<BlogCardProps, 'metadata' | 'basePath' | 'renderLink'>;
}

export function BlogList({
	metadata,
	basePath = '/blog',
	renderLink,
	className = '',
	emptyMessage = 'No blog posts found.',
	cardProps,
}: BlogListProps) {
	if (metadata.length === 0) {
		return (
			<div className={`text-center text-gray-500 dark:text-gray-400 py-12 ${className}`}>
				{emptyMessage}
			</div>
		);
	}

	return (
		<div className={`space-y-6 ${className}`}>
			{metadata.map((meta) => (
				<BlogCard
					key={meta.slug}
					metadata={meta}
					basePath={basePath}
					renderLink={renderLink}
					{...cardProps}
				/>
			))}
		</div>
	);
}
