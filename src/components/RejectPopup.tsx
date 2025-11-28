import React, { useState, useCallback } from "react";

interface RejectPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (comment: string) => Promise<void>;
}

const RejectPopup: React.FC<RejectPopupProps> = ({
  isOpen,
  onClose,
  onReject,
}) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value);
    },
    []
  );

  const handleReject = useCallback(async () => {
    await onReject(comment);
    setComment("");
    onClose();
  }, [comment, onReject, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Reject Abstract</h2>
        <textarea
          className="w-full h-32 p-2 border rounded mb-4"
          placeholder="Enter rejection reason..."
          value={comment}
          onChange={handleCommentChange}
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white bg-blue-500 font-bold py-2 px-4 rounded"
            onClick={handleReject}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectPopup;
