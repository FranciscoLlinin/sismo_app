import React, { useState, useEffect } from 'react';
import axios from 'axios';



const EarthquakeApp = () => {
  const [features, setFeatures] = useState([]);
  const [filters, setFilters] = useState({ magType: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentBody, setCommentBody] = useState('');
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  useEffect(() => {
    fetchFeatures();
  }, [currentPage, filters]);

  const fetchFeatures = async () => {
    try {
      const response = await axios.get('/api/features', {
        params: {
          filters: {
            mag_type: filters.magType.join(','),
          },
          page: currentPage,
        },
      });
      setFeatures(response.data.data);
      setTotalPages(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const handleFilterChange = (magType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      magType: prevFilters.magType.includes(magType)
        ? prevFilters.magType.filter((type) => type !== magType)
        : [...prevFilters.magType, magType],
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post('/api/features', {
        feature_id: selectedFeatureId,
        body: commentBody,
      });
      setCommentBody('');
      setSelectedFeatureId(null);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div>
      <h1>Earthquake App</h1>
      <div>
        <h3>Filters</h3>
        {['md', 'ml', 'ms', 'mw', 'me', 'mi', 'mb', 'mlg'].map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              checked={filters.magType.includes(type)}
              onChange={() => handleFilterChange(type)}
            />
            {type}
            
          </label>
        ))}
      </div>
      <div>
        <h3>Features</h3>
        <ul>
          {features.map((feature) => (
            <li key={feature.id}>
              <h4>{feature.attributes.title}</h4>
              <p>Magnitude: {feature.attributes.magnitude}</p>
              <p>Place: {feature.attributes.place}</p>
              <p>Type of Magnitude: {feature.attributes.mag_type}</p>
              <p>
                Coordinates: {feature.attributes.coordinates.longitude},{' '}
                {feature.attributes.coordinates.latitude}
              </p>
              <a href={feature.links.url}>External URL</a>
              <button onClick={() => setSelectedFeatureId(feature.id)}>
                Add Comment
              </button>
            </li>
          ))}
        </ul>
        <div>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
      {selectedFeatureId && (
        <div>
          <h3>Add Comment</h3>
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>Submit Comment</button>
        </div>
      )}
    </div>
  );
};

export default EarthquakeApp;