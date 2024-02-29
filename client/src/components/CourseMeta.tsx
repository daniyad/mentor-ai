import { FaUserGraduate, FaClock, FaCertificate, FaCheckSquare } from 'react-icons/fa';
import { Card, CardHeader, CardBody, Text, Heading, SimpleGrid, HStack } from '@chakra-ui/react'

export const CourseMeta = ({ level, timeToComplete, prerequisites }: { level: string, timeToComplete: string, prerequisites: string }) => {
  return (
    <HStack>
      <Card>
        <CardHeader>
          <Heading size='md'> Skill Level </Heading>
        </CardHeader>
        <CardBody>
          <Text> {level} </Text>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <Heading size='md'> Time to complete </Heading>
        </CardHeader>
        <CardBody>
          <Text> {timeToComplete} </Text>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <Heading size='md'> Certificate </Heading>
        </CardHeader>
        <CardBody>
          <Text> At the end of the course </Text>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <Heading size='md'> Prerequisites </Heading>
        </CardHeader>
        <CardBody>
          <Text> {prerequisites} </Text>
        </CardBody>
      </Card>
    </HStack>
  )
};