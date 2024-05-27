import { FiBookOpen } from 'react-icons/fi';
import { BsClockHistory } from 'react-icons/bs';
import { PiCertificate, PiListMagnifyingGlassThin } from 'react-icons/pi';

import { Flex, Box, Text, HStack, VStack } from '@chakra-ui/react'

export const CourseMeta = ({ level, timeToComplete, prerequisites }: { level: string, timeToComplete: number, prerequisites: string[] }) => {
  return (
    <Box p={3} mx={5} className='rounded-lg'>
      <Flex w="full">
        <HStack spacing={3} flexBasis="25%" justify="center">
          <FiBookOpen size="20px" color="gray" />
          <VStack spacing={0} align="start" >
            <Text fontSize="small" color="gray">
              Skill level
            </Text>
            <Text color="white" fontWeight="bold" fontSize="small">{level}</Text>
          </VStack>
        </HStack>
        <HStack spacing={3} flexBasis="25%" justify="center">
          <BsClockHistory size="20px" color="gray"></BsClockHistory>
          <VStack spacing={0} align="start" >
            <Text fontSize="small" color="gray">
              Time to complete
            </Text>
            <Text color="white" fontWeight="bold" fontSize="small">{`${timeToComplete} hours`}</Text>
          </VStack>
        </HStack>
        <HStack spacing={3} flexBasis="25%" justify="center">
          <PiCertificate color="gray" size="20px"></PiCertificate>
          <VStack spacing={0} align="start" >
            <Text fontSize="small" color="gray">
              Certificate
            </Text>
            <Text color="white" fontWeight="bold" fontSize="small">Upon completion</Text>
          </VStack>
        </HStack>
        <HStack spacing={3} flexBasis="25%" justify="center">
          <PiListMagnifyingGlassThin color="gray" size="20px"></PiListMagnifyingGlassThin>
          <VStack spacing={0} align="start">
            <Text fontSize="small" color="gray">
              Prerequisites
            </Text>
            <Text color="white" fontWeight="bold" fontSize="small">
              {prerequisites.length === 0 ? "None" : prerequisites.join(', ')}
            </Text>
          </VStack>
        </HStack>
      </Flex>
    </Box>
  )
};