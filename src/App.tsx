import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Download } from './components/tabs/download';
import { Upload } from './components/tabs/upload';
import { SheetSelector } from './components/tabs/sheetSelector';
import { useExcelData } from './context/ExcelDataContext';
import { useTabContext } from './context/TabContext';
import { useReset } from './hooks/useReset';

function App() {
  const { xlsxData } = useExcelData();
  const { timer, defaultIndex } = useTabContext();
  const reset = useReset();

  const maxTime = 2;
  const dims: BoxProps = {
    height: '30rem',
    width: '90vw',
    borderRadius: '2xl',
    borderStyle: 'solid',
    borderWidth: '2px',
  };

  useEffect(() => {
    const resetTabs = () => {
      if (xlsxData.length === 0) {
        reset();
      }
    };

    resetTabs();
  }, [xlsxData.length]);

  return (
    <Box>
      <Flex
        direction='column'
        align='center'
        gap='4rem'
        mt='2rem'
        overflow='hidden'
      >
        <Heading size='2xl'>Excel Sheet Merger</Heading>
        <Tabs
          align='start'
          index={defaultIndex}
          defaultIndex={defaultIndex}
          flexGrow={1}
        >
          <TabList>
            <Tooltip
              label='Uploaded the wrong file? Click here to upload again.'
              isOpen={defaultIndex !== 0 && timer < maxTime}
              hasArrow
            >
              <Tab onClick={reset}>Upload</Tab>
            </Tooltip>
            <Tab isDisabled={defaultIndex !== 1}>Sheet Selector</Tab>
            <Tab isDisabled={defaultIndex !== 2}>Download</Tab>
          </TabList>

          <TabPanels>
            {/* Upload */}
            <TabPanel>
              <Upload maxLoadingTime={maxTime} {...dims} />
            </TabPanel>

            {/* View */}
            <TabPanel>
              <SheetSelector {...dims} />
            </TabPanel>

            {/* Download */}
            <TabPanel>
              <Download {...dims} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
}

export default App;
