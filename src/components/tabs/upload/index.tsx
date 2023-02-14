import { BoxProps, Flex, Spinner } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { read, utils } from 'xlsx';
import { useExcelData } from '../../../context/ExcelDataContext';
import { useTabContext } from '../../../context/TabContext';
import { SheetData } from '../../../types';
import { FileUploader } from './FileUploader';

interface UploadProps extends BoxProps {
  /** The total number of seconds to show the spinner before it gets reset. */
  maxLoadingTime: number;
}

export const Upload: React.FC<UploadProps> = ({ maxLoadingTime, ...rest }) => {
  const [errorMsg, setErrorMsg] = useState('');

  const ref = useRef<HTMLInputElement>(null);

  const { timer, isLoading, setDefaultIndex, setTimer, setIsLoading } =
    useTabContext();
  const { setXlsxData } = useExcelData();

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer?.((t) => t + 1);
    }, 1000);

    if (timer === maxLoadingTime) {
      clearInterval(interval);
      setTimer?.(0);
    }
  };

  const onFileUpload = () => {
    if (!errorMsg) {
      setIsLoading?.(true);
      setDefaultIndex?.((idx) => idx + 1);
      setTimer?.(0);
      startTimer();
    }
  };

  if (isLoading)
    return (
      <Flex {...rest} display='flex' justify='center' align='center'>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='black.500'
          size='xl'
        />
      </Flex>
    );

  return (
    <FileUploader
      totalFiles={2}
      ref={ref}
      accept='.xlsx'
      errorMessage={errorMsg}
      handleFiles={(files) => {
        Object.values(files).forEach(async (file) => {
          const { name } = file;
          const extension = name.slice(name.lastIndexOf('.'));

          if (extension === '.xlsx') {
            const newXlsxData = await file.arrayBuffer();
            const { SheetNames, Sheets } = read(newXlsxData);
            const data = utils.sheet_to_json<SheetData>(Sheets[SheetNames[0]]);
            const headers = Object.keys(data[0]);

            setXlsxData?.((prev) => [
              ...new Set([
                ...prev,
                {
                  name,
                  file,
                  sheets: SheetNames.map((sheetName) => ({
                    data,
                    headers,
                    name: sheetName,
                  })),
                },
              ]),
            ]);
          } else {
            setErrorMsg('Please upload only .xlsx files');
          }
        });
      }}
      onChange={onFileUpload as any}
      {...rest}
    />
  );
};
