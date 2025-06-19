import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full text-center">
				<div className="mb-8">
					<h1 className="text-6xl font-bold text-gray-300">404</h1>
					<h2 className="text-2xl font-semibold text-gray-700 mt-4">
						Listing Not Found
					</h2>
					<p className="text-gray-500 mt-2">
						The listing you're looking for doesn't exist or has been removed.
					</p>
				</div>

				<Link
					href="/"
					className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					<svg
						className="w-4 h-4 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<title>Home icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						/>
					</svg>
					Back to Home
				</Link>
			</div>
		</div>
	);
}
