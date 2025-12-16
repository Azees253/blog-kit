'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			// Show button when page is scrolled down 300px
			if (typeof window !== 'undefined' && (window as Window).scrollY > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		if (typeof window !== 'undefined') {
			(window as Window).addEventListener('scroll', toggleVisibility);
			return () => window.removeEventListener('scroll', toggleVisibility);
		}
	}, []);

	const scrollToTop = () => {
		if (typeof window !== 'undefined') {
			(window as Window).scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	};

	return (
		<button
			onClick={scrollToTop}
			className={cn(
				'fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full cursor-pointer',
				'bg-linear-to-br from-primary via-primary/90 to-primary/80',
				'text-primary-foreground shadow-lg shadow-primary/25',
				'transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/30',
				'active:scale-95',
				'flex items-center justify-center',
				'border border-primary-foreground/10',
				isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
			)}
			aria-label="Scroll to top"
		>
			<ArrowUp className="h-5 w-5" />
		</button>
	);
}
