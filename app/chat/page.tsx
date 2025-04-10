// page.tsx
"use client";

import { useState } from "react";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

import { styles } from "@/shared/lib/styles";
import Header from "@/shared/components/Header";
export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const chats: Chat[] = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "Meeting at 2 PM",
      timestamp: "Yesterday",
    },
    {
      id: 3,
      name: "Group Chat",
      lastMessage: "Party tonight!",
      timestamp: "Monday",
    },
  ];

  const messages: { [key: number]: Message[] } = {
    1: [
      {
        id: 1,
        sender: "John Doe",
        content: "Hey, how are you?",
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        sender: "You",
        content: "Good, thanks! You?",
        timestamp: "10:31 AM",
      },
    ],
    2: [
      {
        id: 1,
        sender: "Jane Smith",
        content: "Meeting at 2 PM",
        timestamp: "9:15 AM",
      },
      {
        id: 2,
        sender: "You",
        content: "Got it, see you there",
        timestamp: "9:16 AM",
      },
    ],
    3: [
      {
        id: 1,
        sender: "Mike",
        content: "Party tonight!",
        timestamp: "8:00 PM",
      },
      { id: 2, sender: "Sarah", content: "Count me in!", timestamp: "8:05 PM" },
    ],
  };

  return (
    <>
      <Header />
      <div className="flex h-screen" style={{ backgroundColor: styles.warmBg }}>
        {/* Chat List Sidebar */}
        <div
          className="w-1/3 overflow-y-auto"
          style={{
            backgroundColor: "#FFFFFF",
            borderRight: `1px solid ${styles.warmBorder}`,
          }}
        >
          <div
            className="p-4"
            style={{ borderBottom: `1px solid ${styles.warmBorder}` }}
          >
            <h1
              className="text-xl font-bold"
              style={{ color: styles.warmText }}
            >
              Chats
            </h1>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="p-4 cursor-pointer"
              style={{
                backgroundColor:
                  selectedChat === chat.id ? styles.warmBg : "#FFFFFF",
                ":hover": { backgroundColor: styles.warmBg },
              }}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-center">
                <div
                  className="w-12 h-12 rounded-full mr-3"
                  style={{ backgroundColor: styles.warmBorder }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h2
                      className="font-semibold"
                      style={{ color: styles.warmText }}
                    >
                      {chat.name}
                    </h2>
                    <span
                      className="text-sm"
                      style={{ color: styles.warmAccentDark }}
                    >
                      {chat.timestamp}
                    </span>
                  </div>
                  <p
                    className="text-sm truncate"
                    style={{ color: styles.warmText }}
                  >
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div
                className="p-4 flex items-center"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderBottom: `1px solid ${styles.warmBorder}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full mr-3"
                  style={{ backgroundColor: styles.warmBorder }}
                ></div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: styles.warmText }}
                >
                  {chats.find((chat) => chat.id === selectedChat)?.name}
                </h2>
              </div>

              {/* Messages */}
              <div
                className="flex-1 p-4 overflow-y-auto"
                style={{ backgroundColor: styles.warmBg }}
              >
                {messages[selectedChat]?.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.sender === "You" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className="max-w-xs p-3 rounded-lg"
                      style={{
                        backgroundColor:
                          message.sender === "You"
                            ? styles.warmPrimary
                            : "#FFFFFF",
                        color:
                          message.sender === "You"
                            ? "#FFFFFF"
                            : styles.warmText,
                      }}
                    >
                      <p>{message.content}</p>
                      <span
                        className="text-xs opacity-75"
                        style={{
                          color:
                            message.sender === "You"
                              ? styles.warmAccent
                              : styles.warmAccentDark,
                        }}
                      >
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div
                className="p-4"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderTop: `1px solid ${styles.warmBorder}`,
                }}
              >
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-l-md focus:outline-none"
                    style={{
                      border: `1px solid ${styles.warmBorder}`,
                      backgroundColor: styles.warmBg,
                      color: styles.warmText,
                    }}
                  />
                  <button
                    className="p-2 rounded-r-md"
                    style={{
                      backgroundColor: styles.warmPrimary,
                      color: "#FFFFFF",
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              className="flex-1 flex items-center justify-center"
              style={{ color: styles.warmText }}
            >
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </>
  );
}
