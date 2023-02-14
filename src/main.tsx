import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ExcelDataContextProvider } from './context/ExcelDataContext';
import { TabContextProvider } from './context/TabContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <TabContextProvider>
        <ExcelDataContextProvider>
          <App />
        </ExcelDataContextProvider>
      </TabContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
