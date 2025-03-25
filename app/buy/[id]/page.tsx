"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { playfair } from "@/lib/fonts";
import { styles } from "@/lib/styles";
import { Item } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import Header from "@/components/Sidebar";

export default function BuyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndItem() {
      try {
        setLoading(true);
        setError(null);

        // Get current user (if logged in)
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase
            .from("user")
            .select("*")
            .eq("userid", user.id)
            .single();

          setCurrentUser(userData);
        }

        // Fetch item from Supabase directly
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error("Item not found");
        }

        setItem(data as Item);

        // Fetch questions for this item
        const { data: questionsData, error: questionsError } = await supabase
          .from("faq")
          .select(
            `
            id, 
            item_id, 
            user_id, 
            question, 
            answer,
            created_at,
            user_name,
            is_answered
          `
          )
          .eq("item_id", resolvedParams.id)
          .order("created_at", { ascending: false });

        if (!questionsError) {
          setQuestions(questionsData || []);
        }
      } catch (err: any) {
        console.error("Error fetching item:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndItem();
  }, [resolvedParams.id]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !item) return;

    try {
      // Get the username if user is logged in, otherwise use "Anonymous"
      const userName = currentUser ? currentUser.name : "Anonymous User";

      // Get current user ID if logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id || null;

      const { error } = await supabase
        .from("questions")
        .insert({
          item_id: item.id,
          user_id: userId,
          question: newQuestion,
          user_name: userName,
          created_at: new Date().toISOString(),
          is_answered: false,
        })
        .select();

      if (error) throw error;

      // Refresh questions
      const { data: questionsData } = await supabase
        .from("questions")
        .select(
          `
          id, 
          item_id, 
          user_id, 
          question, 
          answer,
          created_at,
          user_name,
          is_answered
        `
        )
        .eq("item_id", item.id)
        .order("created_at", { ascending: false });

      setQuestions(questionsData || []);
      setNewQuestion("");
    } catch (err) {
      console.error("Error posting question:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center ml-64 bg-white rounded-lg">
        <Loader2
          className="w-10 h-10 animate-spin mb-4"
          style={{ color: styles.warmPrimary }}
        />
        <p style={{ color: styles.warmText }}>Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center ml-64 bg-white rounded-lg">
        <div
          className="bg-white p-6 border w-full max-w-md text-center rounded-lg"
          style={{ borderColor: styles.warmBorder }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: styles.warmText }}
          >
            {error || "Item not found"}
          </h2>
          <a
            href="/"
            className="inline-block py-2 px-4 font-semibold text-white rounded-lg"
            style={{ backgroundColor: styles.warmPrimary }}
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && currentUser.userid === item?.user_id;

  return (
    <div className="h-screen">
      <Header />

      <div className="max-w-6xl mx-auto p-4 ml-64">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery Section (Left) */}
          <div className="space-y-4">
            {/* Main image display */}
            {item.image_url && item.image_url.length > 0 ? (
              <div
                className="bg-white p-2 border overflow-hidden aspect-square rounded-lg"
                style={{ borderColor: styles.warmBorder }}
              >
                <img
                  src={item.image_url[activeImage]}
                  alt={item.title}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            ) : null}

            {/* Thumbnail gallery */}
            {item.image_url && item.image_url.length > 0 && (
              <div className="flex overflow-x-auto gap-2 pb-2">
                {item.image_url.map((url, idx) => (
                  <div
                    key={idx}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden cursor-pointer rounded-lg`}
                    style={{
                      border:
                        activeImage === idx
                          ? `2px solid ${styles.warmPrimary}`
                          : `1px solid ${styles.warmBorder}`,
                    }}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img
                      src={url}
                      alt={`${item.title} - view ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item details section (Right) */}
          <div
            className="space-y-4 bg-white p-6 border rounded-lg"
            style={{ borderColor: styles.warmBorder }}
          >
            <h1
              className={`text-3xl font-bold ${playfair.className}`}
              style={{ color: styles.warmText }}
            >
              {item.title}
            </h1>

            <p
              className="text-2xl font-semibold"
              style={{ color: styles.warmPrimary }}
            >
              ₹{(item.price || 0).toFixed(2)}
            </p>

            {item.status && (
              <div className="flex items-center">
                <span
                  className={`text-sm px-3 py-1 rounded-full`}
                  style={{
                    backgroundColor:
                      item.status === "available"
                        ? "rgba(184, 110, 84, 0.1)"
                        : item.status === "pending"
                        ? "rgba(216, 140, 101, 0.2)"
                        : "rgba(227, 220, 208, 0.5)",
                    color:
                      item.status === "available"
                        ? styles.warmPrimary
                        : item.status === "pending"
                        ? styles.warmAccentDark
                        : styles.warmText,
                  }}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            )}

            <div
              className="border-t border-b py-4 my-4"
              style={{ borderColor: styles.warmBorder }}
            >
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: styles.warmText }}
              >
                Description
              </h2>
              <p style={{ color: styles.warmText }}>{item.description}</p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                className="w-full py-3 px-4 font-semibold text-white rounded-lg"
                style={{ backgroundColor: styles.warmPrimary }}
                onClick={() => router.push(`/chat?listing=${item.id}&seller=${item.user_id}`)}
              >
                Contact Seller
              </button>

              <button
                className="w-full py-3 px-4 font-semibold border rounded-lg"
                style={{
                  color: styles.warmText,
                  borderColor: styles.warmBorder,
                  backgroundColor: "white",
                }}
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          className="mt-8 bg-white p-6 border-t border-b border-l border-r rounded-lg"
          style={{ borderColor: styles.warmBorder }}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${playfair.className}`}
            style={{ color: styles.warmText }}
          >
            Frequently Asked Questions
          </h2>

          {/* Question Form */}
          <form onSubmit={handleSubmitQuestion} className="mb-6">
            <div className="flex flex-col space-y-2">
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full p-3 border rounded-lg"
                style={{ borderColor: styles.warmBorder }}
                placeholder="Ask a question about this item..."
                rows={3}
                required
              />
              <button
                type="submit"
                className="self-end py-2 px-4 font-semibold text-white rounded-lg"
                style={{ backgroundColor: styles.warmPrimary }}
              >
                Post Question
              </button>
            </div>
          </form>

          {/* Questions & Answers List */}
          <div className="space-y-6">
            {questions.length > 0 ? (
              questions.map((qa) => (
                <div
                  key={qa.id}
                  className="border-t border-b border-l border-r p-4 rounded-lg"
                  style={{ borderColor: styles.warmBorder }}
                >
                  {/* Question */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <p
                        className="font-semibold flex items-center"
                        style={{ color: styles.warmText }}
                      >
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                          Q
                        </span>
                        {qa.user_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(qa.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p style={{ color: styles.warmText }}>{qa.question}</p>
                  </div>

                  {/* Answer (if available) */}
                  {qa.answer && (
                    <div
                      className="ml-4 pl-4 border-l-2"
                      style={{ borderColor: styles.warmPrimary }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p
                          className="font-semibold flex items-center"
                          style={{ color: styles.warmPrimary }}
                        >
                          <span
                            className="text-xs font-medium mr-2 px-2.5 py-0.5"
                            style={{
                              backgroundColor: styles.warmPrimary,
                              color: "white",
                            }}
                          >
                            A
                          </span>
                          Seller's Response
                        </p>
                      </div>
                      <p style={{ color: styles.warmText }}>{qa.answer}</p>
                    </div>
                  )}

                  {/* Reply button (only visible to item owner) */}
                  {isOwner && !qa.answer && (
                    <div className="mt-2 text-right">
                      <a
                        href={`/profile/items/${item.id}/faq/${qa.id}`}
                        className="text-sm"
                        style={{ color: styles.warmPrimary }}
                      >
                        Reply to this question
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">
                No questions yet. Be the first to ask!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
