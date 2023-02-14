import {
  Box,
  BoxProps,
  Button,
  Flex,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import { useExcelData } from '../../../context/ExcelDataContext';
import { SelectedSheetsProvider } from '../../../context/SelectedSheetsContext';
import { useTabContext } from '../../../context/TabContext';
import { SheetSelectorCard } from './SheetSelectorCard';

interface SheetSelectorProps extends BoxProps {}

export const SheetSelector: FC<SheetSelectorProps> = ({ ...rest }) => {
  const { setDefaultIndex } = useTabContext();
  const { xlsxData, sheetNames, selectedSheets } = useExcelData();

  const isDisabled = useMemo(
    () => selectedSheets.map((sheet) => Object.values(sheet)[0]).flat(),
    [selectedSheets]
  );

  const merge = () => {
    setDefaultIndex?.((idx) => idx + 1);
  };

  return (
    <Box {...rest}>
      <Flex direction='column' mx='.5rem' mt='.8rem' gap='3'>
        <SimpleGrid columns={2} spacing={10} mx='.5rem'>
          {xlsxData
            .sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              } else if (a.name > b.name) {
                return 1;
              } else {
                return 0;
              }
            })
            .map(({ name: filename }, idx) => (
              <SelectedSheetsProvider filename={filename} key={idx}>
                <SheetSelectorCard
                  filename={filename}
                  sheetNames={sheetNames[filename]}
                  idx={idx}
                  height='25rem'
                />
              </SelectedSheetsProvider>
            ))}
        </SimpleGrid>
        <Flex align='center' alignSelf='flex-end' gap={3}>
          {isDisabled.length < 2 && (
            <Text color='red.400' fontWeight='bold'>
              Please select at least{' '}
              <strong>{isDisabled.length === 0 ? 2 : 1}</strong> sheets in order
              to merge
            </Text>
          )}
          <Button
            alignSelf='flex-end'
            isDisabled={isDisabled.length < 2}
            onClick={merge}
          >
            Merge
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
