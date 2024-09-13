import axios from "axios";
import { SearchDTO } from "../dto/SearchDTO";
import { AirportDTO } from "../dto/AirportDTO";
import { useCallback, useEffect, useState } from "react";
import debounce from "../utils/Debouncer";
import { SearchResponseDTO } from "../dto/SearchResponseDTO";
import { useEnvConfigContext } from "../hooks/EnvConfig";

interface RequesterProps {
  initialUrl: string;
  method: Request;
  debounceTime: number;
  body: string;
  headers: string;
}

interface Requester<Data> {
  response: Data | undefined;
  isLoading: boolean;
  error: Error | undefined;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
}

interface Error {
  message: string;
  fromServer: boolean;
}

type Request = "get";

const useAxiosWithDebounce = <Data,>({
  initialUrl,
  method,
  debounceTime,
  body,
  headers,
}: RequesterProps): Requester<Data> => {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState<Data | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const appConfig = useEnvConfigContext();

  const fetchData = useCallback(
    debounce(async (url: string) => {
      setIsLoading(true);
      setError(undefined);
      axios[method](appConfig.backBaseUrl + initialUrl + url)
        .then((res) => {
          setResponse(res.data);
        })
        .catch((err) => {
        if (err.response)
            setError({
              message: err.response.status + " " + err.response.data.error,
              fromServer: true,
            });
          else
            setError({
              message: "Service unavailable, contact administrator.",
              fromServer: false,
            });
        })
        .finally(() => {
          setIsLoading(false);
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
  debounceTime,
  body,
  headers,
}: RequesterProps): Requester<Data> => {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState<Data | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const appConfig = useEnvConfigContext();

  const fetchData = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(undefined);
    axios[method](appConfig.backBaseUrl + initialUrl + url)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        if (err.response)
          setError({
            message: err.response.status + err.response.data,
            fromServer: true,
          });
        else
          setError({
            message: "Service unavailable, contact administrator.",
            fromServer: false,
          });
      })
      .finally(() => {
        setIsLoading(false);
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

const useSearchFlights = (query: SearchDTO) => {
  const preparedQuery = {
    ...query,
    adults: query.adults.toString(),
    nonStop: query.nonStop.toString(),
  };

  return useAxios<SearchResponseDTO>({
    initialUrl:
      "/flight/search?" + new URLSearchParams(preparedQuery).toString(),
    method: "get",
    debounceTime: 0,
    body: "",
    headers: "",
  });
};

export { useGetAirports, useSearchFlights };
