import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const DocViewer = dynamic(() => import("react-doc-viewer"), {
  ssr: false,
});

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}) => {
  const [corsError, setCorsError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset CORS error state when modal opens
      setCorsError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const documents = [{ uri: fileUrl, fileName: fileName }];

  const handleError = (error: any) => {
    console.error("DocViewer error:", error);
    setCorsError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{fileName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          {corsError ? (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="text-red-500 mb-4">
                Unable to load the document due to CORS restrictions.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Document
              </a>
            </div>
          ) : (
            <DocViewer
              documents={documents}
              config={{
                header: {
                  disableHeader: true,
                  disableFileName: true,
                  retainURLParams: false,
                },
              }}
              style={{ height: "100%" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
