import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Chat, Message, User, Item } from "@/app/lib/types";
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatProducts, setChatProducts] = useState<Record<number, Item>>({});
  const [chatUsers, setChatUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const { userId } = useAuth();

  // Fetch chats for the current user
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        // Get current user from session storage if userId from useAuth is not available
        const currentUserId = userId || sessionStorage.getItem("user_id");

        if (currentUserId) {
          const chatData = await getChats(currentUserId);
          setChats(chatData);

          // Fetch product details for each chat
          const productIds = chatData
            .map((chat) => chat.product_id)
            .filter(Boolean); // Filter out nulls and undefined

          if (productIds.length > 0) {
            const { data: products } = await supabase
              .from("products")
              .select("*")
              .in("id", productIds);

            console.log("Products:", products);

            const productsMap: Record<string, Item> = {};
            products?.forEach((product: Item) => {
              productsMap[product.id] = product;
            });

            // Create a mapping of chat_id to product
            const chatProductsMap: Record<number, Item> = {};
            chatData.forEach((chat) => {
              if (chat.product_id && productsMap[chat.product_id]) {
                chatProductsMap[chat.id] = productsMap[chat.product_id];
              }
            });

            setChatProducts(chatProductsMap);
          }

          // Fetch user details for each chat
          const userIds: string[] = [];
          chatData.forEach((chat) => {
            if (chat.buyer_id && chat.buyer_id !== currentUserId)
              userIds.push(chat.buyer_id);
            if (chat.seller_id && chat.seller_id !== currentUserId)
              userIds.push(chat.seller_id);
          });

          if (userIds.length > 0) {
            const { data: users } = await supabase
              .from("users")
              .select("*")
              .in("id", [...new Set(userIds)]);

            const usersMap: Record<string, User> = {};
            users?.forEach((user: User) => {
              usersMap[user.id] = user;
            });

            setChatUsers(usersMap);
          }
        } else {
          setError("User not authenticated");
        }
      } catch (err: unknown) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (!selectedChatId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const messagesData = await getMessages(selectedChatId);
        setMessages(messagesData);
      } catch (err: unknown) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages in the selected chat
    const subscription = supabase
      .channel(`chat:${selectedChatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `id=eq.${selectedChatId}`,
        },
        (payload) => {
          setMessages((currentMessages) => [
            ...currentMessages,
            payload.new as Message,
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedChatId]);

  const getChats = async (userId: string) => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const getMessages = async (chatId: number) => {
    // First get the chat to find buyer and seller
    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .single();

    if (chatError) throw chatError;

    if (!chatData) throw new Error("Chat not found");

    // Get messages where sender is either buyer or seller and receiver is either buyer or seller
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `seller_id.eq.${chatData.buyer_id},seller_id.eq.${chatData.seller_id}`
      )
      .or(`buyer_id.eq.${chatData.buyer_id},buyer_id.eq.${chatData.seller_id}`)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  };

  const sendMessage = async (message: string) => {
    if (!selectedChatId) return false;

    try {
      // Use session storage instead of supabase auth
      const currentUserId = sessionStorage.getItem("user_id");

      if (!currentUserId) {
        setError("User not authenticated");
        return false;
      }

      // Get the chat to determine recipient
      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .select("*")
        .eq("id", selectedChatId)
        .single();

      if (chatError) {
        setError(chatError.message);
        return false;
      }

      // Determine receiver based on sender
      const receiverId =
        currentUserId === chatData.buyer_id
          ? chatData.seller_id
          : chatData.buyer_id;

      const { error } = await supabase.from("messages").insert({
        seller_id: currentUserId,
        buyer_id: receiverId,
        message,
        product_id: chatData.product_id || null,
      });

      if (error) {
        setError(error.message);
        return false;
      }

      return true;
    } catch (err: unknown) {
      setError(err.message);
      return false;
    }
  };

  const sendMessageWithDetails = async (
    chatId: number,
    senderId: string,
    message: string,
    productId?: string
  ) => {
    // Get the chat to determine recipient
    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .single();

    if (chatError) throw chatError;

    // Determine receiver based on sender
    const receiverId =
      senderId === chatData.buyer_id ? chatData.seller_id : chatData.buyer_id;

    const { data, error } = await supabase
      .from("messages")
      .insert({
        seller_id: senderId,
        buyer_id: receiverId,
        message,
        product_id: productId || chatData.product_id || null,
      })
      .select();

    if (error) throw error;
    return data?.[0] || null;
  };

  const createChat = async (
    buyerId: string,
    sellerId: string,
    productId?: string
  ) => {
    const { data, error } = await supabase
      .from("chats")
      .insert({
        buyer_id: buyerId,
        seller_id: sellerId,
        product_id: productId || null,
      })
      .select();

    if (error) throw error;
    return data?.[0] || null;
  };

  return {
    messages,
    chats,
    chatProducts,
    chatUsers,
    loading,
    error,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
    getChats,
    getMessages,
    sendMessageWithDetails,
    createChat,
  };
};
