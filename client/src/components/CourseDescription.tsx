import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { IoCheckmark } from 'react-icons/io5';


export const CourseDescription = ({ description, skills }: { description: string, skills: string }) => {
  return (
    <Box p={5} m={5}>
      <HStack spacing={8} align="start">
        <VStack align="start" flex={8}>
          <Text fontSize="2xl" fontWeight="bold" color="white">About this course</Text>
          <Text color="white">{description}</Text>
        </VStack>
        <VStack align="start" flex={2}>
          <Text fontSize="2xl" fontWeight="bold" color="white">Skills you'll gain</Text>
          <VStack align="start" spacing={2}>
            {skills.split(',').map((skill, index) => (
              <HStack key={index} spacing={0}>
                <IoCheckmark color="white" />
                <Text as="li" color="white" sx={{ listStyleType: 'none', marginLeft: '5px' }}>{skill}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </HStack>
    </Box>
  );
};

