import { useExcelData } from '../context/ExcelDataContext';
import { useTabContext } from '../context/TabContext';

export function useReset() {
  const { setXlsxData, setSelectedSheets } = useExcelData();
  const { setDefaultIndex, setTimer, setIsLoading } = useTabContext();

  const reset = () => {
    setDefaultIndex?.(0);
    setTimer?.(0);
    setIsLoading?.(false);
    setXlsxData?.([]);
    setSelectedSheets?.([]);
  };

  return reset
}
