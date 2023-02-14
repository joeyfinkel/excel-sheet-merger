import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useExcelData } from '../../../context/ExcelDataContext';
import { useSelectedSheets } from '../../../context/SelectedSheetsContext';
import { uniqueArrayOfObjects } from '../../../utils';

interface SheetSelectorButtonProps {
  filename: string;
  text: string;
  onSheetClick?: (sheetName: string) => void;
}

export const SheetSelectorButton: React.FC<SheetSelectorButtonProps> = ({
  filename,
  text,
  onSheetClick,
}) => {
  const [active, setActive] = useState('');
  const { setSelectedSheets } = useExcelData();

  return (
    <Button
      backgroundColor={active === text ? 'blue.500' : ''}
      onClick={() => {
        if (active === text) {
          setActive('');
          // Removes the deselected sheet from the selectedSheets array
          setSelectedSheets?.((prev) =>
            prev.map((item) => {
              const key = Object.keys(item)[0];
              
              item[key] = item[key].filter((i) => i !== text);

              return item;
            })
          );

          return;
        }

        setActive(text);
        onSheetClick?.(text);
      }}
      _hover={{
        backgroundColor: active === text ? 'blue.500' : ' gray.300',
      }}
    >
      {text}
    </Button>
  );
};
