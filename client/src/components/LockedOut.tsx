import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Text } from '@chakra-ui/react';
import { BiLockAlt } from 'react-icons/bi';
import MainHeading from '../components/MainHeading'

const LockedOutPage = () => {
    const navigate = useNavigate();

    const handleSignInClick = () => {
        navigate('/login');
    };

    return (
        <div>
            <MainHeading data={{ status: "logged-out" }} />

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
                        Please sign-in to access this page
                    </Text>
                    <Button colorScheme="orange" mt={5} onClick={handleSignInClick}>
                        Sign In
                    </Button>
                </Center>
            </Box>
        </div>
    );
};

export default LockedOutPage;