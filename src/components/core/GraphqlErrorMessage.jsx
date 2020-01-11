import React from 'react';

const GraphqlErrorMessage = ({ error, critical = false }) => {
  const color = critical ? 'red' : 'green';
  return (
    <div>
      {error.graphQLErrors.map((err, index) => (
        <p key={index} style={{ color: color }}>
          {err.message}
        </p>
      ))}
    </div>
  );
};

export default GraphqlErrorMessage;
