type BadgeProps = {
	children: string;
	className?: string;
};

export function Badge({ children, className }: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full border border-transparent bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-500 ${className}`}
		>
			{children}
		</span>
	);
}
