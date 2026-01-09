import React, { useState, useCallback } from "react";

interface RejectionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onReject: (comment: string) => Promise<void>;
}

const RejectionPopup: React.FC<RejectionPopupProps> = ({
    isOpen,
    onClose,
    onReject,
}) => {
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCommentChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setComment(e.target.value);
        },
        []
    );

    const handleReject = useCallback(async () => {
        if (!comment.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }
        setIsSubmitting(true);
        try {
            await onReject(comment);
            setComment("");
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    }, [comment, onReject, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-2 text-red-600">Reject Abstract</h2>
                <p className="text-sm text-gray-600 mb-4">
                    This action will permanently reject the abstract. The author will be notified via email.
                </p>
                <textarea
                    className="w-full h-32 p-2 border border-red-300 rounded mb-4 text-black focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter reason for rejection (required)..."
                    value={comment}
                    onChange={handleCommentChange}
                    required
                />
                <div className="flex justify-end">
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        onClick={handleReject}
                        disabled={isSubmitting || !comment.trim()}
                    >
                        {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectionPopup;
