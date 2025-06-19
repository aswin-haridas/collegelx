import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types";

export default function Card({ item }: { item: Listing }) {
	return (
		<Link href={`/listings/${item.id}`}>
			<div className="bg-beige-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-beige-200">
				<div className="relative h-48 mb-4">
					{item.images && item.images.length > 0 ? (
						<Image
							src={item.images[0]}
							alt={item.name}
							fill
							className="object-cover rounded"
						/>
					) : (
						<div className="w-full h-full bg-beige-200 rounded flex items-center justify-center">
							<span className="text-brown-500 text-sm">No image</span>
						</div>
					)}
				</div>
				<h2 className="text-lg font-bold text-brown-900 mb-2">{item.name}</h2>
				<p className="text-sm text-brown-600 mb-2 line-clamp-2">
					{item.description}
				</p>
				<p className="text-lg font-semibold text-brown-700">
					${item.price.toFixed(2)}
				</p>
				<div className="mt-2">
					<span className="inline-block bg-brown-100 text-brown-800 text-xs font-medium px-2 py-1 rounded">
						{item.condition}
					</span>
				</div>
			</div>
		</Link>
	);
}
