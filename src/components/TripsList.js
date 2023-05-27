import React from 'react';
import Trip from './Trip';

const TripsList = (props) => {
  const { trips } = props;
  return (
    <div>
      {trips?.map((trip) => (
        <Trip key={trip.id} trip={trip} />
      ))}
    </div>
  );
};

export default TripsList;
