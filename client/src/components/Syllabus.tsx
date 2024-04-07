import { Box, HStack, VStack, Text, Divider, Button } from '@chakra-ui/react';
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { SectionData } from '../types/general';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useState } from 'react';

const Syllabus = ({ sections, courseId }: { sections: SectionData[]; courseId: number }) => {
  const [showProblems, setShowProblems] = useState<Array<boolean>>(sections.map(() => false));

  return (
    <Box p={5} m={5} border="1px solid" borderColor="gray.700" borderRadius="lg" background="#1A1A1A">
      <VStack spacing={4} align="start">
        <Text color="white" fontSize="2xl" fontWeight="bold">Syllabus</Text>
        <Divider />
        {sections.map((section: SectionData, sectionIndex: number) => (
          <VStack key={section.id} spacing={3} align="start" w="full">
            <HStack w="full" justifyContent="space-between">
              <Text color="white" fontSize="xl" fontWeight="bold">{section.title}</Text>
              <Button background="none" _hover={{ bg: 'none' }} onClick={() => {
                const newShowProblems = [...showProblems];
                newShowProblems[sectionIndex] = !newShowProblems[sectionIndex];
                setShowProblems(newShowProblems);
              }}>
                {showProblems[sectionIndex] ? <IoChevronUp color="white" size="1.5em" /> : <IoChevronDown size="1.5em" color="white"/>}
              </Button>
            </HStack>
            <Text color="white">{section.short_description}</Text>
            {showProblems[sectionIndex] && (
            <VStack align="start" w="full">
              <HStack w="full">
                <Box flex={1}>
                  <Text color="grey" fontWeight="bold">Status</Text>
                </Box>
                <Text flex={10} color="grey" fontWeight="bold">Problem Name</Text>
                <Text flex={5} color="grey" fontWeight="bold" textAlign="left">Difficulty</Text>
              </HStack>
              {section.problems.map((problem, index) => (
                <Box as={Link} key={index} to={`/problems/${courseId}/${section.id}/${problem.id}`} w="full" display="flex" textDecoration="none">
                  <HStack w="full">
                    <Box flex={1}>
                      {problem.isSolved ? <FaRegCircleCheck size="30px" color="green" /> : <FaRegCircleXmark size="30px" color="red" />}
                    </Box>
                    <Text flex={10} color="white" _hover={{ color: "white", fontWeight: "bold" }}>{problem.name}</Text>
                    <Text flex={5} color={problem.difficulty === 'Easy' ? 'green' : problem.difficulty === 'Medium' ? 'orange' : 'red'} textAlign="left">{problem.difficulty}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
            )}
          </VStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Syllabus;
