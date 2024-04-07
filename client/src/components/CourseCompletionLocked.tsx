import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Text } from '@chakra-ui/react';
import { BiLockAlt } from 'react-icons/bi';
import MainHeading from '../components/MainHeading'

const CourseCompletionLocked = () => {
    const navigate = useNavigate();

    const handleSignInClick = () => {
        navigate('/course');
    };

    return (
        <div>
            <MainHeading data={{ status: "logged-in" }} />

            <Box
                bg="rgba(0, 0, 0, 0.5)"
                w="100vw"
                h="100vh"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                backdropFilter="blur(5px)"
            >
                <Center flexDirection="column" mt={10}>
                    <BiLockAlt size="2em" color="white" />
                    <Text color="white" mt={5}>
                        Course is locked until all the problems are cleared
                    </Text>
                    <Button colorScheme="orange" mt={5} onClick={handleSignInClick}>
                        Go to problems page
                    </Button>
                </Center>
            </Box>
        </div>
    );
};

export default CourseCompletionLocked;