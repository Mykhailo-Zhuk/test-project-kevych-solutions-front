import './App.css';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { images } from './constants';
import TripsList from './components/TripsList';

export default function App() {
  const [trips, setTrips] = useState([]);
  const [formatedListOfTrips, setFormatedListOfTrips] = useState([]);
  const [error, setError] = useState(null);
  const [formStatus, setFormStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    start: '',
    end: '',
    when: '',
  });

  const fetchTripsHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3001/');
      if (!response.status === 200) {
        throw new Error('Error fetching trips');
      }
      const transformedTrips = response.data.map((trip) => {
        const transformedDate = new Date(trip.departure_date);

        return {
          id: trip.id,
          start: trip.startpoint,
          end: trip.endpoint,
          when: transformedDate.toLocaleDateString(),
        };
      });
      setLoading(false);
      setTrips(transformedTrips);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchTripsHandler();
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const name = e.target.name.trim();
    const value = e.target.value.trim();
    console.log(name, value);
    console.log(query);
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);
    setFormStatus(true);
    let formatedQuery;
    console.log(query);
    const { start, end, when } = query;

    if (start === '' && end === '' && when === '') {
      setError('Fill all fields');
      setLoading(false);
      setFormStatus(false);
    } else if (start === '' && end === '' && when !== '') {
      console.log('Case 1');
      const formatedDate = new Date(when);
      formatedQuery = trips.filter((trip) => trip.when === formatedDate.toLocaleDateString());
    } else if (start !== '' && end !== '' && when === '') {
      console.log('Case 2');
      formatedQuery = trips.filter((trip) => trip.start.trim() === start.trim());
    } else if (start !== '' && end === '' && when === '') {
      formatedQuery = trips.filter((trip) => trip.start.trim() === start.trim());
    }

    if (formatedQuery.length === 0) return setError('Found no trips');

    setFormatedListOfTrips(formatedQuery);
    setLoading(false);
  };

  const resetHandler = () => {
    window.location.reload();
    setFormStatus(false);
    setLoading(false);
    setError(null);
  };

  let content = <p style={{ textAlign: 'center' }}>Found no trips</p>;

  if (error) {
    console.log(error);
    content = <p style={{ textAlign: 'center' }}>{error}</p>;
  }

  if (formStatus && !error) {
    content = <TripsList trips={formatedListOfTrips} />;
  }

  if (loading && !error) {
    content = <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${images.image2})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}>
      <h1>Search for railway tickets</h1>
      <div className="form-back">
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label" htmlFor="start">
              From?
            </label>
            <input
              name="start"
              className="input"
              value={query.from}
              type="text"
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label className="label" htmlFor="end">
              To?
            </label>
            <input
              name="end"
              className="input"
              value={query.to}
              type="text"
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label className="label" htmlFor="when">
              When?
            </label>
            <input
              name="when"
              className="when"
              value={query.when}
              type="date"
              onChange={handleChange}
            />
          </div>
          <button className="btn" type="submit">
            <span>Send</span>
          </button>
          <button className="btn" type="reset" onClick={resetHandler}>
            <span>Clear</span>
          </button>
        </form>
        <section>{content}</section>
      </div>
    </div>
  );
}
