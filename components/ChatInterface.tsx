"use client";

import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/lib/chatStore";
import Image from "next/image";
import type { ChatMessage } from "@/types";

interface ChatInterfaceProps {
	listingId: string;
	sellerId: string;
	buyerId: string;
	listingName: string;
	sellerName: string;
	onClose: () => void;
}

export default function ChatInterface({
	listingId,
	sellerId,
	buyerId,
	listingName,
	sellerName,
	onClose,
}: ChatInterfaceProps) {
	const [message, setMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesLengthRef = useRef(0);
	const {
		currentChatRoom,
		messages,
		isLoading,
		currentUser,
		createChatRoom,
		sendMessage,
		loadMessages,
		setCurrentUser,
	} = useChatStore();

	useEffect(() => {
		// Set current user (in a real app, this would come from auth)
		setCurrentUser(buyerId);

		// Initialize chat room if it doesn't exist
		const initializeChat = async () => {
			if (!currentChatRoom) {
				const chatRoom = await createChatRoom(listingId, sellerId, buyerId);
				if (chatRoom) {
					await loadMessages(chatRoom.id);
				}
			} else {
				await loadMessages(currentChatRoom.id);
			}
		};

		initializeChat();
	}, [
		listingId,
		sellerId,
		buyerId,
		currentChatRoom,
		createChatRoom,
		loadMessages,
		setCurrentUser,
	]);

	useEffect(() => {
		// Scroll to bottom when new messages arrive
		if (messages.length !== messagesLengthRef.current) {
			messagesLengthRef.current = messages.length;
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages.length]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		await sendMessage(message);
		setMessage("");
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (isLoading) {
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-beige-50 rounded-lg p-6">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brown-600 mx-auto"></div>
					<p className="text-brown-700 mt-2">Loading chat...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-beige-50 rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
				{/* Header */}
				<div className="bg-brown-600 text-beige-50 p-4 rounded-t-lg flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-brown-500 rounded-full flex items-center justify-center">
							<span className="text-beige-50 font-semibold">
								{sellerName.charAt(0).toUpperCase()}
							</span>
						</div>
						<div>
							<h3 className="font-semibold">{sellerName}</h3>
							<p className="text-beige-200 text-sm">{listingName}</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-beige-50 hover:text-beige-200 transition-colors"
						aria-label="Close chat"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
					{messages.length === 0 ? (
						<div className="text-center text-brown-600 mt-8">
							<p>Start a conversation about this item!</p>
						</div>
					) : (
						messages.map((msg: ChatMessage) => {
							const isOwnMessage = msg.sender_id === currentUser;
							return (
								<div
									key={msg.id}
									className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
											isOwnMessage
												? "bg-brown-600 text-beige-50 rounded-br-none"
												: "bg-beige-200 text-brown-800 rounded-bl-none"
										}`}
									>
										<p className="text-sm">{msg.message}</p>
										<p
											className={`text-xs mt-1 ${
												isOwnMessage ? "text-beige-200" : "text-brown-600"
											}`}
										>
											{msg.created_at ? formatTime(msg.created_at) : ""}
										</p>
									</div>
								</div>
							);
						})
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Message Input */}
				<form
					onSubmit={handleSendMessage}
					className="p-4 border-t border-beige-200"
				>
					<div className="flex space-x-2">
						<input
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Type a message..."
							className="flex-1 px-4 py-2 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent bg-beige-100 text-brown-800 placeholder-brown-500"
						/>
						<button
							type="submit"
							disabled={!message.trim()}
							className="px-4 py-2 bg-brown-600 text-beige-50 rounded-lg hover:bg-brown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							aria-label="Send message"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
								/>
							</svg>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
