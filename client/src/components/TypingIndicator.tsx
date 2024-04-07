import React from 'react';
import { Box, Circle } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
    0% { opacity: 0.5; }
    100% { opacity: 1; }
`;

const TypingIndicator = () => {
    return (
        <Box display="flex" alignItems="center">
            <Circle size="8px" bg="white" margin="2px" css={{ animation: `${pulse} 0.4s infinite alternate` }}/>
            <Circle size="8px" bg="white" margin="2px" css={{ animation: `${pulse} 0.4s infinite alternate 0.1s` }}/>
            <Circle size="8px" bg="white" margin="2px" css={{ animation: `${pulse} 0.4s infinite alternate 0.2s` }}/>
        </Box>
    );
};

export default TypingIndicator;