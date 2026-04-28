import * as React from 'react';

export interface StateWrapProps {
  isLoaded: boolean;
  isLoading?: boolean;
  error?: any;
  loadingContent?: React.ReactNode;
  errorContent?: React.ReactNode;
  children: React.ReactNode;
}
// @ts-ignore
const StateWrap: React.FC<StateWrapProps> = (props: StateWrapProps) => {
  const { isLoading, isLoaded, error, loadingContent, errorContent, children } =
    props;
  if (error && errorContent) {
    return errorContent;
  }
  if (isLoading && loadingContent) {
    return loadingContent;
  }
  if (isLoaded) {
    return children;
  }

  return null;
};

export default StateWrap;
