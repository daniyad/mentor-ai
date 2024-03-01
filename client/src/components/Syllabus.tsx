import { Box, HStack, VStack, Text, Divider } from '@chakra-ui/react';
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import SignalCellularAlt1BarOutlinedIcon from "@mui/icons-material/SignalCellularAlt1BarOutlined";
import SignalCellularAlt2BarOutlinedIcon from "@mui/icons-material/SignalCellularAlt2BarOutlined";
import SignalCellularAltOutlinedIcon from "@mui/icons-material/SignalCellularAltOutlined";

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
                {section.problems.map((problem, index) => (
                  // Icon first showing whether it is complete or not, difficulty text, problem name
                  <HStack key={index} w="full">
                    <Text flex={10} color="white">{problem.name}</Text>
                    <Text flex={5} color="white" textAlign="left">Difficulty:{problem.difficulty}</Text>
                    <Box flex={1}>
                      {problem.isSolved ? <FaRegCircleCheck size="30px" color="green" /> : <FaRegCircleXmark size="30px" color="red" />}
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          ))}
        </VStack>
      </Box>
    );
  };

export default Syllabus;
