import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types";
import { colors } from "./colors";

export default function Card({ item }: { item: Listing }) {
	if (!item) return null;

	return (
		<Link href={`/buy/${item.id}`}>
			<div
				className={`${colors.background.white} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 p-4 border ${colors.border.secondary} cursor-pointer hover:scale-[1.02]`}
			>
				<div className="relative mb-4">
					{item?.images && item.images.length > 0 ? (
						<div className="rounded-lg overflow-hidden">
							<Image
								src={item.images[0]}
								alt={`Image of ${item.name || "product"}`}
								height={300}
								width={300}
								className="w-full h-48 object-cover"
								priority={false}
							/>
						</div>
					) : (
						<div className="h-48 w-full bg-gray-100 flex justify-center items-center rounded-lg text-gray-400">
							<span className="text-sm">No image available</span>
						</div>
					)}
				</div>

				<div className="space-y-2">
					<h3
						className={`text-lg font-medium ${colors.text.primary} line-clamp-1`}
					>
						{item?.name || "Untitled Item"}
					</h3>
					{item?.condition && (
						<p className={`text-sm ${colors.text.muted} capitalize`}>
							{item.condition}
						</p>
					)}
					{item?.description && (
						<p className={`text-sm line-clamp-2 ${colors.text.secondary}`}>
							{item.description}
						</p>
					)}
					<p className={`text-lg font-bold ${colors.text.primary}`}>
						₹{item?.price?.toLocaleString() || "0"}
					</p>
				</div>
			</div>
		</Link>
	);
}
