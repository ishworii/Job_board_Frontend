import { Flex, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export const Logo = () => {
  return (
    <Flex as={RouterLink} to="/" align="center" gap={2}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        bgGradient="linear(to-r, teal.500, teal.300)"
        bgClip="text"
        _hover={{ bgGradient: "linear(to-r, teal.300, teal.500)" }}
      >
        JobHub
      </Text>
    </Flex>
  )
}
