import { DocsSidebar } from '@/components/docs-sidebar';
import { ScrollToTop } from '@/components/scroll-to-top';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen overflow-x-hidden">
			<DocsSidebar />
			<div className="lg:ml-72 max-w-full relative">
				{/* Subtle dot pattern background */}
				<div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.05)_1px,transparent_0)] bg-size-[24px_24px] pointer-events-none -z-10" />

				<main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-5 bg-linear-to-br from-background via-background to-muted/10">
					<div>{children}</div>
				</main>

				<ScrollToTop />
			</div>
		</div>
	);
}
