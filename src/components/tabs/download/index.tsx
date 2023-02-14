import { BoxProps, Flex, IconButton, Spinner, Text } from '@chakra-ui/react';
import { FC, useEffect, useMemo, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { utils, write } from 'xlsx';
import { useExcelData } from '../../../context/ExcelDataContext';
import { useReset } from '../../../hooks/useReset';
import { SheetData } from '../../../types';
import { mergeArrayOfObjects } from '../../../utils';

interface DownloadProps extends BoxProps {}

export const Download: FC<DownloadProps> = ({ ...rest }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [mergedArray, setMergedArray] = useState<SheetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedSheets, xlsxData } = useExcelData();
  const reset = useReset();

  const message = useMemo(() => {
    const test = selectedSheets
      .map((sheet) => Object.values(sheet).flat())
      .flat();
    const { length } = test;

    return `Merging ${length} sheets together`;
  }, [selectedSheets]);

  const downloadData = (array: SheetData[]) => {
    const ws = utils.json_to_sheet(array);
    const wb = utils.book_new();

    utils.book_append_sheet(wb, ws, 'Sheet1');

    setFileUrl(
      URL.createObjectURL(
        new Blob([write(wb, { type: 'array' })], {
          type: 'application/octet-stream',
        })
      )
    );
    reset();
  };

  useEffect(() => {
    setIsLoading(true);

    const jsonData = selectedSheets
      .map((value) => {
        return Object.entries(value).map(([key, value]) => {
          const found = xlsxData.find((sheet) => sheet.name === key);

          if (found)
            return found.sheets.filter(({ name }) => value.includes(name))[0]
              .data;

          return [];
        });
      })
      .flat();

    setMergedArray(mergeArrayOfObjects({}, ...jsonData));
    setIsLoading(false);
  }, [selectedSheets, xlsxData]);

  return (
    <Flex {...rest} justify='center' align='center' direction='column' gap={5}>
      {isLoading ? (
        <>
          <Text fontSize='xl'>{message}...</Text>
          <Spinner />
        </>
      ) : (
        <a href={fileUrl} download='data.xlsx'>
          <IconButton
            aria-label='Download sheet'
            variant='ghost'
            fontSize='3rem'
            icon={<FaDownload />}
            onClick={() => downloadData(mergedArray)}
          />
        </a>
      )}
    </Flex>
  );
};
