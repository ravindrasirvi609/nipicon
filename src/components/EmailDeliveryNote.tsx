import React from "react";
import { Info } from "lucide-react";

const EmailDeliveryNote = () => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 flex items-start gap-3 shadow-sm">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900 dark:text-blue-200 space-y-1">
                <p className="font-semibold">NOTE:</p>
                <p>
                    Upon successful submission, you will receive an acknowledgement email
                    with a link to the Participant Details Dashboard.
                </p>
                <p>
                    You can check the progress and status of your submission on the
                    dashboard.
                </p>
                <p className="font-medium text-blue-800 dark:text-blue-300">
                    If you do not receive any email after submission, please check your SPIR
                    / JUNK folder.
                </p>
            </div>
        </div>
    );
};

export default EmailDeliveryNote;
