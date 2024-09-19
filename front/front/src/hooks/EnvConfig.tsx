import { createContext, useContext, useState, ReactNode, FC } from "react";
import { EnvironmentVariables } from "../types/Config";

const Config = (): EnvironmentVariables => ({
  appVersion: process.env["REACT_APP_VERSION"] ?? "",
  backBaseUrl: process.env["REACT_APP_BACK_BASE_URL"] ?? "",
});

const EnvConfigContext = createContext<EnvironmentVariables | undefined>(
  undefined
);

const EnvConfigProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <EnvConfigContext.Provider value={Config()}>
      {children}
    </EnvConfigContext.Provider>
  );
};

// Custom hook to use the context
const useEnvConfigContext = () => {
  const context = useContext(EnvConfigContext);
  if (!context) {
    throw new Error(
      "useEnvConfigContext must be used within a EnvConfigProvider"
    );
  }
  return context;
};

export { EnvConfigProvider, useEnvConfigContext} 