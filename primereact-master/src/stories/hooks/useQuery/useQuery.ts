import { useCallback, useEffect, useState } from 'react';

// @ts-ignore
type QueryFnType<T, A> = (...args: A) => Promise<T>;

type UseQueryType = <T, A>(
  params: UseQueryParamsType<T, A>
) => {
  data: T | undefined;
  isLoading: boolean;
  isLoaded: boolean;
  error: unknown;
  refetch: QueryFnType<T, A>;
};

export interface UseQueryParamsType<T, A> {
  queryFn: QueryFnType<T, A>;
  onLoaded?: (data?: T) => void;
  onLoading?: () => void;
  enabled?: boolean;
}

export const useQuery: UseQueryType = <T, A>(
  params: UseQueryParamsType<T, A>
) => {
  const { queryFn, enabled = true, onLoaded, onLoading } = params;
  const [callOnLoaded, setCallOnLoaded] = useState<boolean>(false);
  const [callOnLoading, setCallOnLoading] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(enabled);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [error, setErrors] = useState<unknown>();
  const [data, setData] = useState<T>();

  const refetch = useCallback<QueryFnType<T, A>>(
    // @ts-ignore
    async (...args) => {
      setLoading(true);
      setLoaded(false);
      setCallOnLoaded(false);
      try {
        // @ts-ignore
        const response = await queryFn(...args);
        setLoading(false);
        setLoaded(true);
        setCallOnLoading(false);
        setData(response);
        return response;
      } catch (err) {
        setLoading(false);
        setLoaded(true);
        setCallOnLoading(false);
        setErrors(err);
        throw err;
      }
    },
    [queryFn]
  );

  useEffect(() => {
    if (enabled) {
      // @ts-ignore
      refetch();
    }
  }, [enabled, refetch]);

  if (onLoaded && !callOnLoaded && isLoaded && !isLoading) {
    setCallOnLoaded(true);
    setTimeout(() => {
      onLoaded(data);
    });
  }

  if (onLoading && !callOnLoading && isLoading && !isLoaded) {
    setCallOnLoading(true);
    setTimeout(() => {
      onLoading();
    });
  }

  return {
    data,
    isLoading,
    isLoaded,
    error,
    refetch,
  };
};
