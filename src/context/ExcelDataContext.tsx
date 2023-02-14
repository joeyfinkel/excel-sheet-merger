import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SelectedSheet, XLSXFile } from '../types';

interface IXlsxDataContext {
  xlsxData: XLSXFile[];
  setXlsxData?: Dispatch<SetStateAction<XLSXFile[]>>;

  selectedSheets: SelectedSheet[];
  setSelectedSheets?: Dispatch<SetStateAction<SelectedSheet[]>>;
}

const XlsxDataContext = createContext<IXlsxDataContext>({
  xlsxData: [],
  selectedSheets: [],
});

export const ExcelDataContextProvider = ({ children }: PropsWithChildren) => {
  const [xlsxData, setXlsxData] = useState<XLSXFile[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<SelectedSheet[]>([]);

  return (
    <XlsxDataContext.Provider
      value={{ xlsxData, setXlsxData, selectedSheets, setSelectedSheets }}
    >
      {children}
    </XlsxDataContext.Provider>
  );
};

export const useExcelData = () => {
  const context = useContext(XlsxDataContext);
  const [sheetNames, setSheetNames] = useState<SelectedSheet>({});

  useEffect(() => {
    const updateSheetNames = () => {
      const { xlsxData } = context;
      const names = xlsxData
        .map((data) => data)
        .map(({ sheets, name: filename }) => ({
          [filename]: sheets.map(({ name: sheetName }) => sheetName),
        }))
        .reduce((merged, item) => {
          const key = Object.keys(item)[0];

          if (!merged[key]) {
            merged[key] = [];
          }

          merged[key].push(...item[key]);

          return merged;
        }, {});

      setSheetNames(names);
    };

    updateSheetNames();
  }, [context.xlsxData]);

  return { sheetNames, ...context };
};
