import { Box, CardProps, Flex } from '@chakra-ui/react';
import { useExcelData } from '../../../context/ExcelDataContext';
import { uniqueArrayOfObjects } from '../../../utils';
import { BaseCard } from '../../BaseCard';
import { SheetSelectorButton } from './SheetSelectorButton';

interface SheetSelectorCardProps extends Omit<CardProps, 'onClick'> {
  filename: string;
  idx: number;
  sheetNames: string[];
}

export const SheetSelectorCard: React.FC<SheetSelectorCardProps> = ({
  idx: fileIdx,
  filename,
  sheetNames,
  ...rest
}) => {
  const { selectedSheets, xlsxData, setXlsxData, setSelectedSheets } =
    useExcelData();

  const onCardClose = (filename: string) => {
    const index = xlsxData.findIndex((file) => file.name === filename);
    const copyOfData = [...xlsxData].filter((_, idx) => idx !== index);

    setXlsxData?.(copyOfData);
    setSelectedSheets?.((prev) =>
      prev.filter((value) => Object.keys(value)[0] !== filename)
    );
  };

  const handleClick = (sheetName: string) => {
    setSelectedSheets?.((prev) => {
      const filtered = prev.filter((value) => value[filename]);
      const newSheets: string[] = [sheetName];

      if (filtered) {
        const filteredSheetNames = filtered
          .map((value) => [...value[filename], ...newSheets])
          .flat();

        newSheets.push(...filteredSheetNames);
      }

      return uniqueArrayOfObjects(
        [
          ...prev,
          {
            [filename]: [...new Set([...newSheets])].sort(),
          },
        ].sort()
      );
    });
  };

  return (
    <BaseCard
      title={filename}
      onCardClose={() => onCardClose(filename)}
      {...rest}
    >
      <Flex justify='space-between'>
        <Flex direction='column' gap={3}>
          {sheetNames?.map((sheetName, idx) => (
            <SheetSelectorButton
              key={idx}
              filename={filename}
              text={sheetName}
              onSheetClick={() => handleClick(sheetName)}
            />
          ))}
        </Flex>
        <Box alignSelf='center'>
          {/*
            selected sheet data goes here
            ex: total columns, rows, etc
          */}
        </Box>
      </Flex>
    </BaseCard>
  );
};
