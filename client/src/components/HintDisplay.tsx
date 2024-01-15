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
    // Ensure that 'data.hint' is defined before accessing 'data.hint.hint'
    const hintString = data.hint ? data.hint.hint : 'No hint available';
    
    return (
        <div>
            <div className="text-[14px] text-text_2 mx-auto text-center mt-[50px]">
                    {hintString}
            </div>
        </div>
    )
};

export default HintDisplay;

