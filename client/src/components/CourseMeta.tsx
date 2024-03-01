import { FiBookOpen } from 'react-icons/fi';
import { BsClockHistory } from 'react-icons/bs';
import { PiCertificate, PiListMagnifyingGlassThin } from 'react-icons/pi';

import { Box, Text, HStack, VStack } from '@chakra-ui/react'

export const CourseMeta = ({ level, timeToComplete, prerequisites }: { level: string, timeToComplete: string, prerequisites: string }) => {
  return (
    <Box p={5} mx={5} border="1px solid" borderColor="gray.700" borderRadius="lg" >
      <HStack w="full" justify="center" spacing={10}>
        <HStack spacing={3}>
          <FiBookOpen size="25px" color="gray" />
          <VStack spacing={0} align="start" >
            <Text fontSize="x-small" color="gray">
              Skill level
            </Text>
            <Text color="white" fontWeight="bold">{level}</Text>
          </VStack>
        </HStack>
        <HStack spacing={3}>
          <BsClockHistory size="25px" color="gray"></BsClockHistory>
          <VStack spacing={0} align="start" >
            <Text fontSize="x-small" color="gray">
              Time to complete
            </Text>
            <Text color="white" fontWeight="bold">{timeToComplete}</Text>
          </VStack>
        </HStack>
        <HStack spacing={3}>
          <PiCertificate color="gray" size="25px"></PiCertificate>
          <VStack spacing={0} align="start" >
            <Text fontSize="x-small" color="gray">
              Certificate
            </Text>
            <Text color="white" fontWeight="bold">At the end of the course</Text>
          </VStack>
        </HStack>
        <HStack spacing={3}>
          <PiListMagnifyingGlassThin color="gray" size="25px"></PiListMagnifyingGlassThin>
          <VStack spacing={0} align="start">
            <Text fontSize="x-small" color="gray">
              Prerequisites
            </Text>
            <Text color="white" fontWeight="bold">{prerequisites}</Text>
          </VStack>
        </HStack>
      </HStack>
    </Box>
  )
};