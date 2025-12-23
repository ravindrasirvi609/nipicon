import React, { useState, useCallback } from "react";

interface RejectPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (
    comment: string,
    revisions: {
      abstract: boolean;
      declaration: boolean;
      profile: boolean;
    }
  ) => Promise<void>;
}

const RejectPopup: React.FC<RejectPopupProps> = ({
  isOpen,
  onClose,
  onReject,
}) => {
  const [comment, setComment] = useState("");
  const [revisions, setRevisions] = useState({
    abstract: false,
    declaration: false,
    profile: false,
  });

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value);
    },
    []
  );

  const handleReject = useCallback(async () => {
    await onReject(comment, revisions);
    setComment("");
    setRevisions({ abstract: false, declaration: false, profile: false });
    onClose();
  }, [comment, revisions, onReject, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Revision Abstract</h2>
        <textarea
          className="w-full h-32 p-2 border rounded mb-4 text-black"
          placeholder="Enter revision reason..."
          value={comment}
          onChange={handleCommentChange}
        />
        <div className="space-y-2 mb-6 text-black">
          <p className="font-semibold text-sm mb-1">Select items for revision:</p>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={revisions.abstract}
              onChange={(e) =>
                setRevisions((prev) => ({ ...prev, abstract: e.target.checked }))
              }
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-gray-300"
            />
            <span className="text-sm">Abstract in WORD File</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={revisions.declaration}
              onChange={(e) =>
                setRevisions((prev) => ({
                  ...prev,
                  declaration: e.target.checked,
                }))
              }
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-gray-300"
            />
            <span className="text-sm">Declaration Signed SCAN Copy</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={revisions.profile}
              onChange={(e) =>
                setRevisions((prev) => ({ ...prev, profile: e.target.checked }))
              }
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-gray-300"
            />
            <span className="text-sm">Brief Profile - CV</span>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleReject}
          >
            Confirm Revision
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectPopup;
