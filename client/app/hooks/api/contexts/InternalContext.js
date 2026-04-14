import React from "react";

const InternalContext = React.createContext({
  requests: [],
  resolved: false
});

export const createServerFetchDataContext = () => {
  const internalContextValue = {
    requests: [],
    resolved: false
  };
  function ServerFetchDataContext(props) {
    return (
      <InternalContext.Provider value={internalContextValue}>
        {props.children}
      </InternalContext.Provider>
    );
  }
  const isFetchingComplete = async () => {
    const effects = internalContextValue.requests.map(item => item.promise);
    await Promise.all(effects);
    internalContextValue.resolved = true;
  };
  return {
    ServerFetchDataContext,
    isFetchingComplete
  };
};

export default InternalContext;
