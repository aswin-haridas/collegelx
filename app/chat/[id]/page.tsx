"use client";
import { AlertCircle, ArrowLeft, Loader2, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import type { ChatMessage } from "@/types";

export default function ChatPage() {
	const [chatState, setChatState] = useState({
		messages: [] as ChatMessage[],
		newMessage: "",
		sending: false,
		loading: true,
		error: null as string | null,
	});

	const [participantInfo] = useState({
		receiverName: null as string | null,
		listingInfo: null as { name: string; price: number; id: string } | null,
	});

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	const userId = sessionStorage.getItem("user_id");
	const receiverId =
		searchParams?.get("receiverId") || sessionStorage.getItem("receiver_id");
	const listingId =
		searchParams?.get("listingId") || sessionStorage.getItem("listing_id");

	useEffect(() => {
		if (!userId || !receiverId || !listingId) {
			router.push("/messages");
			return;
		}

		if (receiverId) sessionStorage.setItem("receiver_id", receiverId);
		if (listingId) sessionStorage.setItem("listing_id", listingId);

		return () => {
			toast.success("Chat connection closed");
		};
	}, [userId, receiverId, listingId, router]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const goToListing = () => {
		if (listingId) {
			router.push(`/buy/${listingId}`);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			goToListing();
		}
	};

	if (chatState.loading) {
		return (
			<div className="h-screen flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (chatState.error) {
		return (
			<div className="h-screen flex items-center justify-center">
				<div className="bg-red-50 p-4 rounded-lg text-center">
					<AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
					<p className="text-red-500">{chatState.error}</p>
					<button
						type="button"
						onClick={() => router.push("/messages")}
						className="mt-4 px-4 py-2 rounded-lg text-white"
					>
						Back to Messages
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen flex">
			<div className="flex-1 flex flex-col">
				<div className="p-4 border-b flex items-center justify-between">
					<div className="flex items-center">
						<button
							type="button"
							onClick={() => router.push("/messages")}
							className="mr-4 p-2 rounded-full hover:bg-gray-100"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
						<div>
							<h2 className="font-medium text-lg">
								{participantInfo.receiverName || "Chat"}
							</h2>
						</div>
					</div>

					{participantInfo.listingInfo && (
						<button
							type="button"
							className="flex items-center bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
							onClick={goToListing}
						>
							<div>
								<p className="text-sm font-medium">
									{participantInfo.listingInfo.name}
								</p>
								<p className="text-sm">₹{participantInfo.listingInfo.price}</p>
							</div>
						</button>
					)}
				</div>

				<div className="flex-1 overflow-y-auto p-4">
					{chatState.messages.length === 0 ? (
						<div className="h-full flex flex-col items-center justify-center text-gray-500">
							<p>No messages yet</p>
							<p className="text-sm">Start the conversation!</p>
						</div>
					) : (
						<div></div>
					)}
					<div ref={messagesEndRef} />
				</div>
				<form className="p-3 border-t flex">
					<input
						type="text"
						value={chatState.newMessage}
						onChange={(e) =>
							setChatState((prev) => ({ ...prev, newMessage: e.target.value }))
						}
						className="flex-grow p-3 border rounded-lg mr-2"
						placeholder="Type your message..."
						disabled={chatState.sending}
					/>
					<button
						type="submit"
						className="p-3 rounded-lg text-white"
						disabled={!chatState.newMessage.trim() || chatState.sending}
					>
						{chatState.sending ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<Send className="h-5 w-5" />
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
