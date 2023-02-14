import {
  createContext,
  useContext,
  useState,
  FC,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
} from 'react';

interface ISelectedSheetsContext {
  selectedSheets: { [x: string]: string[] };
  setSelectedSheets?: Dispatch<
    SetStateAction<{
      [x: string]: string[];
    }>
  >;
}

type SelectedSheetsContextProps = PropsWithChildren<{ filename: string }>;

const SelectedSheetsContext = createContext<ISelectedSheetsContext>({
  selectedSheets: {},
});

export const SelectedSheetsProvider: FC<SelectedSheetsContextProps> = ({
  children,
  filename,
}) => {
  const [selectedSheets, setSelectedSheets] = useState<{
    [x: string]: string[];
  }>({ [filename]: [] });

  return (
    <SelectedSheetsContext.Provider
      value={{
        selectedSheets,
        setSelectedSheets,
      }}
    >
      {children}
    </SelectedSheetsContext.Provider>
  );
};

export const useSelectedSheets = () => {
  const context = useContext(SelectedSheetsContext);

  if (context === undefined) {
    throw new Error(
      'useSelectedSheets must be used within a SelectedSheetsProvider'
    );
  }

  return context;
};
