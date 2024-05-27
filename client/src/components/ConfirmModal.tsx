import React from 'react';
import ReactDOM from 'react-dom';

const ConfirmModal = ({
    display,
    displayFn,
    onOkFn,
    title,
    message,
}: {
    display: boolean;
    displayFn: React.Dispatch<React.SetStateAction<boolean>>;
    onOkFn: () => void;
    title: string;
    message: string;
}) => {
    if (!display) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] backdrop-blur-sm flex justify-center items-center" style={{fontFamily:'menlo'}}>
            <div className="bg-[#1A1A1A] rounded-lg p-6 max-w-sm mx-auto">
                <h3 className="text-white text-[24px] mb-5 text-center">
                    {title}
                </h3>
                <p className="text-white text-center mb-8">{message}</p>
                <div className="flex gap-3">
                    <button
                        className="flex-1 bg-gray-800 text-white rounded hover:bg-orange-500 text-[14px] py-2 transition duration-300"
                        onClick={() => onOkFn()}
                    >
                        Confirm
                    </button>
                    <button
                        className="flex-1  text-white bg-gray-800 rounded hover:bg-gray-600 hover:text-white text-[14px] py-2 transition duration-300"
                        onClick={() => displayFn(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
