import Link from "next/link";

export default function Navigation() {
	return (
		<nav className="bg-beige-100 border-b border-beige-200 mb-8">
			<div className="max-w-4xl mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="text-2xl font-bold text-brown-900 hover:text-brown-700 transition-colors"
					>
						College Marketplace
					</Link>

					<div className="flex items-center space-x-6">
						<Link
							href="/"
							className="text-brown-700 hover:text-brown-900 transition-colors font-medium"
						>
							Browse Items
						</Link>
						<Link
							href="/create"
							className="text-brown-700 hover:text-brown-900 transition-colors font-medium flex items-center"
						>
							<svg
								className="w-5 h-5 mr-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							Sell Item
						</Link>
						<Link
							href="/profile"
							className="text-brown-700 hover:text-brown-900 transition-colors font-medium flex items-center"
						>
							<svg
								className="w-5 h-5 mr-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							Profile
						</Link>
						<Link
							href="/chat"
							className="text-brown-700 hover:text-brown-900 transition-colors font-medium flex items-center"
						>
							<svg
								className="w-5 h-5 mr-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
							Messages
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
