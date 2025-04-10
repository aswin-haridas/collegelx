import React from "react";
import Modal from "@/shared/components/Modal";
import { Star } from "lucide-react";
import { styles } from "@/shared/lib/styles";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  reviewData: {
    rating: number;
    comment: string;
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reviewData,
  onInputChange,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a Review">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="cursor-pointer mr-2">
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={reviewData.rating === star}
                  onChange={onInputChange}
                  className="sr-only"
                />
                <Star
                  size={24}
                  className={`${
                    star <= reviewData.rating
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            name="comment"
            value={reviewData.comment}
            onChange={onInputChange}
            placeholder="Write your review here..."
            className="w-full border p-2 rounded h-24"
            required
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="px-4 py-2 text-white rounded-lg hover:bg-opacity-90"
            style={{ backgroundColor: styles.warmPrimary }}
          >
            Submit Review
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
