import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { useQuery, UseQueryParamsType } from './useQuery';

const UseQueryComponent = <T, A>(props: UseQueryParamsType<T, A>) => {
  const { data, isLoading, isLoaded, error, refetch } = useQuery(props);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {String(error)}</p>}
      {isLoaded && data && <p>Data loaded: {JSON.stringify(data)}</p>}
      <button onClick={() => refetch()}>Refetch</button>
    </div>
  );
};

export default {
  title: 'Hooks/useQuery',
  component: UseQueryComponent,
} as Meta;

export const SuccessfulQuery: StoryFn = () => {
  const mockQueryFn = async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ message: 'Data loaded successfully' }), 1000);
    });
  };

  return (
    <UseQueryComponent
      queryFn={mockQueryFn}
      onLoaded={() => console.log('Data loaded')}
    />
  );
};

export const ErrorQuery: StoryFn = () => {
  const mockQueryFn = async () => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Failed to load data')), 1000);
    });
  };

  return (
    <UseQueryComponent
      queryFn={mockQueryFn}
      onLoaded={() => console.log('This will not run due to error')}
      onLoading={() => console.log('Loading data')}
    />
  );
};

export const DisabledQuery: StoryFn = () => {
  const mockQueryFn = async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ message: 'Data loaded manually' }), 1000);
    });
  };

  return (
    <UseQueryComponent
      queryFn={mockQueryFn}
      enabled={false}
      onLoaded={() => console.log('Data loaded')}
    />
  );
};
