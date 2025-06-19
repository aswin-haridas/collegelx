"use client";

import { useState, useEffect } from "react";
import { useChatStore } from "@/lib/chatStore";
import Image from "next/image";
import type { ChatRoom } from "@/types";

export default function ChatListPage() {
	const { chatRooms, loadChatRooms, isLoading } = useChatStore();
	const [currentUserId, setCurrentUserId] = useState("current-user-id"); // In a real app, this would come from auth

	useEffect(() => {
		loadChatRooms(currentUserId);
	}, [currentUserId, loadChatRooms]);

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (diffInHours < 48) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString();
		}
	};

	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-brown-900">Messages</h1>
			</div>

			{/* Chat List */}
			<div className="bg-beige-50 rounded-lg shadow-lg border border-beige-200">
				{chatRooms.length === 0 ? (
					<div className="p-8 text-center">
						<div className="w-16 h-16 bg-beige-200 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-8 h-8 text-brown-500"
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
						</div>
						<h2 className="text-xl font-semibold text-brown-700 mb-2">
							No messages yet
						</h2>
						<p className="text-brown-600">
							Start a conversation by viewing an item and clicking "Chat with
							Seller"
						</p>
					</div>
				) : (
					<div className="divide-y divide-beige-200">
						{chatRooms.map((chatRoom: any) => {
							const otherUser =
								chatRoom.seller?.id === currentUserId
									? chatRoom.buyer
									: chatRoom.seller;
							const listing = chatRoom.listings;

							return (
								<div
									key={chatRoom.id}
									className="p-4 hover:bg-beige-100 transition-colors cursor-pointer"
								>
									<div className="flex items-center space-x-4">
										{/* User Avatar */}
										<div className="w-12 h-12 bg-brown-500 rounded-full flex items-center justify-center">
											<span className="text-beige-50 font-semibold">
												{otherUser?.full_name?.charAt(0).toUpperCase() || "U"}
											</span>
										</div>

										{/* Chat Info */}
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start">
												<div>
													<h3 className="text-lg font-semibold text-brown-900 truncate">
														{otherUser?.full_name || "Unknown User"}
													</h3>
													<p className="text-sm text-brown-600 truncate">
														{listing?.name || "Unknown Item"}
													</p>
												</div>
												{chatRoom.last_message_at && (
													<span className="text-xs text-brown-500 whitespace-nowrap ml-2">
														{formatTime(chatRoom.last_message_at)}
													</span>
												)}
											</div>
										</div>

										{/* Item Image */}
										{listing?.images && listing.images.length > 0 && (
											<div className="w-12 h-12 relative rounded-lg overflow-hidden">
												<Image
													src={listing.images[0]}
													alt={listing.name}
													fill
													className="object-cover"
												/>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
