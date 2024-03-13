import { Box, HStack, VStack, Text, Divider } from '@chakra-ui/react';
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Syllabus = ({ sections }: { sections: SectionData[] }) => {
  return (
    <Box p={5} m={5} border="1px solid" borderColor="gray.700" borderRadius="lg">
      <VStack spacing={4} align="start">
        <Text color="white" fontSize="2xl" fontWeight="bold">Syllabus</Text>
        <Divider />
        {sections.map((section: SectionData) => (
          <VStack key={section.id} spacing={3} align="start" w="full">
            <Text color="white" fontSize="xl" fontWeight="bold">{section.title}</Text>
            <Text color="white">{section.short_description}</Text>
            <VStack align="start" w="full">
              <HStack w="full">
                <Box flex={1}>
                  <Text color="grey" fontWeight="bold">Status</Text>
                </Box>
                <Text flex={10} color="grey" fontWeight="bold">Problem Name</Text>
                <Text flex={5} color="grey" fontWeight="bold" textAlign="left">Difficulty</Text>
              </HStack>
              {section.problems.map((problem, index) => (
                <Box as={Link} key={index} to={`/problems/${problem.id}`} w="full" display="flex" textDecoration="none">
                  <HStack w="full">
                    <Box flex={1}>
                      {problem.isSolved ? <FaRegCircleCheck size="30px" color="green" /> : <FaRegCircleXmark size="30px" color="red" />}
                    </Box>
                    <Text flex={10} color="white">{problem.name}</Text>
                    <Text flex={5} color={problem.difficulty === 'Easy' ? 'green' : problem.difficulty === 'Medium' ? 'orange' : 'red'} textAlign="left">{problem.difficulty}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Syllabus;
