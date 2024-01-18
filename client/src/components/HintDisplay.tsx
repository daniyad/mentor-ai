const HintDisplay = ({ data }: { data: HintData }) => {
    if (!data) {
        return (
            <div className="text-[14px] text-text_2 mx-auto text-center mt-[50px]">
                No hint available
            </div>
        );
    }

    if (data.hint && data.hint.error) {
        return (
            <div className="text-[14px] text-text_2 mx-auto text-center mt-[50px]">
                There was the following error: {data.hint.error}
            </div>
        );
    }
    
    return (
        <div>
            <div className="text-[14px] text-text_2 mx-auto text-center mt-[50px]">
                    {data.hint ? data.hint.hint : 'No hint available' }
            </div>
        </div>
    )
};

export default HintDisplay;

