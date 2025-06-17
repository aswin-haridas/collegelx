import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types";
import { colors } from "../ui/colors";

interface ItemCardProps {
	item: Listing;
}

export default function ItemCard({ item }: ItemCardProps) {
	return (
		<Link href={`/buy/${item.id}`} className="block h-full">
			<div
				className={`border ${colors.border.secondary} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col ${colors.background.white}`}
			>
				<div className="relative h-48 bg-gray-50">
					{item.images && item.images.length > 0 ? (
						<Image
							src={item.images[0]}
							alt={item.name}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover"
							placeholder="blur"
							blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
						/>
					) : (
						<div className="w-full h-full bg-gray-200 flex items-center justify-center">
							<span className="text-gray-400">No Image</span>
						</div>
					)}
				</div>
				<div className="p-4 flex flex-col flex-grow">
					<h3 className={`font-medium text-lg mb-2 ${colors.text.primary}`}>
						{item.name}
					</h3>
					<p
						className={`mb-2 text-sm flex-grow line-clamp-2 ${colors.text.secondary}`}
					>
						{item.description}
					</p>
					<div className="flex justify-between items-center mt-2">
						<span className={`font-bold ${colors.text.primary}`}>
							₹{item.price.toFixed(2)}
						</span>
						<span
							className={`text-xs px-2 py-1 ${colors.primary["100"]} rounded-full ${colors.text.primary}`}
						>
							{item.category}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
