import {
  Card,
  CardBody,
  CardHeader,
  CardProps,
  CloseButton,
  CloseButtonProps,
  Flex,
  Text,
} from '@chakra-ui/react';
import { forwardRef, PropsWithChildren } from 'react';

interface BaseCardProps extends CardProps {
  title: string;
  onCardClose?: CloseButtonProps['onClick'];
}

export const BaseCard = forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseCardProps>
>(({ title, children, onCardClose, ...rest }, ref) => {
  return (
    <Card {...rest} ref={ref}>
      <CardHeader fontWeight='bold'>
        <Flex justify='space-between' align='center' gap='3'>
          <Text isTruncated>{title}</Text>
          <CloseButton onClick={onCardClose} />
        </Flex>
      </CardHeader>
      <CardBody overflowX='hidden'>{children}</CardBody>
    </Card>
  );
});
