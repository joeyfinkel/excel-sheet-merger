import { createContext, useContext, useState } from 'react';

interface ITabContext {
  defaultIndex: number;
  setDefaultIndex?: React.Dispatch<React.SetStateAction<number>>;

  timer: number;
  setTimer?: React.Dispatch<React.SetStateAction<number>>;

  isLoading: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabContext = createContext<ITabContext>({
  defaultIndex: 0,
  timer: 0,
  isLoading: false,
});

export const TabContextProvider = ({ children }: React.PropsWithChildren) => {
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TabContext.Provider
      value={{
        defaultIndex,
        timer,
        isLoading,
        setDefaultIndex,
        setTimer,
        setIsLoading,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => useContext(TabContext);
