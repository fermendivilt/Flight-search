import axios from "axios";
import { SearchDTO } from "../dto/SearchDTO";
import { AirportDTO } from "../dto/AirportDTO";
import { useCallback, useEffect, useState } from "react";
import debounce from "../utils/Debouncer";
import { SearchResponseDTO } from "../dto/SearchResponseDTO";
import { useEnvConfigContext } from "../hooks/EnvConfig";
import { EnvironmentVariables } from "../types/Config";

interface RequesterProps<Data> {
  initialUrl: string;
  method: Request;
  existingData?: Data | undefined;
  debounceTime: number;
  body: string;
  headers: string;
}

interface Requester<Data> {
  response: Data | undefined;
  isLoading: boolean;
  error: Error | undefined;
  setUrl: (url: string) => void;
}

interface Error {
  message: string;
  fromServer: boolean;
}

type Request = "get";

interface UseAxiosState<Data> {
  url: string;
  response: Data | undefined;
  isLoading: boolean;
  error: Error | undefined;
  appConfig: EnvironmentVariables;
}

const useAxiosWithDebounce = <Data,>({
  initialUrl,
  method,
  debounceTime,
  body,
  headers,
}: RequesterProps<Data>): Requester<Data> => {
  const [state, setState] = useState<UseAxiosState<Data>>({
    url: "",
    response: undefined,
    isLoading: false,
    error: undefined,
    appConfig: useEnvConfigContext(),
  });

  const { url, response, isLoading, error, appConfig } = state;

  const setUrl = (url: string) => {
    setState((prev) => ({ ...prev, url: url }));
  };

  const fetchData = useCallback(
    debounce(async (url: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
      axios[method](appConfig.backBaseUrl + initialUrl + url)
        .then((res) => {
          setState((prev) => ({ ...prev, response: res.data }));
        })
        .catch((err) => {
          const message = err.response
            ? err.response.status + " " + err.response.data.error
            : "Service unavailable, contact administrator.";
          const fromServer = err.response ? true : false;
          setState((prev) => ({
            ...prev,
            error: { message: message, fromServer: fromServer },
          }));
        })
        .finally(() => {
          setState((prev) => ({ ...prev, isLoading: false }));
        });
    }, debounceTime),
    []
  );

  useEffect(() => {
    if (url) {
      fetchData(url);
    }
  }, [url, fetchData]);

  return { response, isLoading, error, setUrl };
};

const useAxios = <Data,>({
  initialUrl,
  method,
  existingData,
  debounceTime,
  body,
  headers,
}: RequesterProps<Data>): Requester<Data> => {
  const [state, setState] = useState<UseAxiosState<Data>>({
    url: "",
    response: undefined,
    isLoading: false,
    error: undefined,
    appConfig: useEnvConfigContext(),
  });

  const { url, response, isLoading, error, appConfig } = state;

  const setUrl = (url: string) => {
    setState((prev) => ({ ...prev, url: url }));
  };

  const fetchData = useCallback(async (url: string) => {
    if (existingData !== undefined) {
      setState((prev) => ({ ...prev, response: existingData }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
    axios[method](appConfig.backBaseUrl + initialUrl + url)
      .then((res) => {
        setState((prev) => ({ ...prev, response: res.data }));
      })
      .catch((err) => {
        const message = err.response
          ? err.response.status + " " + err.response.data.error
          : "Service unavailable, contact administrator.";
        const fromServer = err.response ? true : false;
        setState((prev) => ({
          ...prev,
          error: { message: message, fromServer: fromServer },
        }));
      })
      .finally(() => {
        setState((prev) => ({ ...prev, isLoading: false }));
      });
  }, []);

  useEffect(() => {
    fetchData(url);
  }, []);

  return { response, isLoading, error, setUrl };
};

const useGetAirports = (query: string): Requester<AirportDTO> => {
  return useAxiosWithDebounce<AirportDTO>({
    initialUrl: "/flight/airports?keyword=" + query,
    method: "get",
    debounceTime: 1500,
    body: "",
    headers: "",
  });
};

const useSearchFlights = (
  query: SearchDTO,
  flights: SearchResponseDTO | undefined
) => {
  const preparedQuery = {
    ...query,
    adults: query.adults.toString(),
    nonStop: query.nonStop.toString(),
  };

  return useAxios<SearchResponseDTO>({
    initialUrl:
      "/flight/search?" + new URLSearchParams(preparedQuery).toString(),
    method: "get",
    existingData: flights,
    debounceTime: 0,
    body: "",
    headers: "",
  });
};

export type { Requester };
export { useGetAirports, useSearchFlights };
