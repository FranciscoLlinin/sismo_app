/* import React, { useState, useEffect } from 'react';
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

export default EarthquakeApp; */

/* import './EarthquakeApp.css';
import CommentModal from './CommentModal.jsx';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EarthquakeApp = () => {
  const [features, setFeatures] = useState([]);
  const [filters, setFilters] = useState({ magType: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentBody, setCommentBody] = useState('');
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

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
    fetchFeatures();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddComment = (featureId) => {
    setSelectedFeatureId(featureId);
    setIsCommentModalOpen(true);
  };

  return (
    <div className="earthquake-app">
      <h1>Earthquake App</h1>
      <div className="filters">
        <h3>Filters</h3>
        {['md', 'ml', 'ms', 'mw', 'me', 'mi', 'mb', 'mlg'].map((type) => (
          <label key={type} className="filter-label">
            <input
              type="checkbox"
              checked={filters.magType.includes(type)}
              onChange={() => handleFilterChange(type)}
            />
            {type}
          </label>
        ))}
      </div>
      <div className="features">
        <h3>Features</h3>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <h4>{feature.attributes.title}</h4>
              <p>Magnitude: {feature.attributes.magnitude}</p>
              <p>Place: {feature.attributes.place}</p>
              <p>Type of Magnitude: {feature.attributes.mag_type}</p>
              <p>
                Coordinates: {feature.attributes.coordinates.longitude},{' '}
                {feature.attributes.coordinates.latitude}
              </p>
              <a href={feature.links.url} className="external-link">
                External URL
              </a>
              <button
                onClick={() => handleAddComment(feature.id)}
                className="add-comment-btn"
              >
                Add Comment
              </button>
            </div>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={page === currentPage}
                className={`pagination-btn ${
                  page === currentPage ? 'active' : ''
                }`}
              >
                {page}
              </button>
            )
          )}
          {totalPages > 5 && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="pagination-btn"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {isCommentModalOpen && (
          <CommentModal
            featureId={selectedFeatureId}
            onClose={() => setIsCommentModalOpen(false)}
            onCommentSubmit={() => {
            fetchFeatures();
            }}
          />
      )}
    </div>
  );
};

export default EarthquakeApp; */




import './EarthquakeApp.css';
import CommentModal from './CommentModal.jsx';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EarthquakeApp = () => {
  const [features, setFeatures] = useState([]);
  const [filters, setFilters] = useState({ md: false, ml: false, ms: false, mw: false, me: false, mi: false, mb: false, mlg: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentBody, setCommentBody] = useState('');
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  
// eslint-disable-next-line
  useEffect(() => {
    fetchFeatures();
    // eslint-disable-next-line
  }, [currentPage, filters]);

  const fetchFeatures = async () => {
    try {
      const response = await axios.get('/api/features', {
        params: {
          filters: {
            ...filters
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

  const handleFilterChange = (type) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: !prevFilters[type]
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddComment = (featureId) => {
    setSelectedFeatureId(featureId);
    setIsCommentModalOpen(true);
  };

  const handleCommentInputChange = (event) => {
    setCommentBody(event.target.value);
};

  return (
    <div className="earthquake-app">
      <h1>Earthquake App</h1>
      <div className="filters">
        <h3>Filters</h3>
        {['md', 'ml', 'ms', 'mw', 'me', 'mi', 'mb', 'mlg'].map((type) => (
          <label key={type} className="filter-label">
            <input
              type="checkbox"
              checked={filters[type]}
              onChange={() => handleFilterChange(type)}
            />
            {type}
          </label>
        ))}
      </div>
      <div className="features">
        <h3>Features</h3>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <h4>{feature.attributes.title}</h4>
              <p>Magnitude: {feature.attributes.magnitude}</p>
              <p>Place: {feature.attributes.place}</p>
              <p>Type of Magnitude: {feature.attributes.mag_type}</p>
              <p>
                Coordinates: {feature.attributes.coordinates.longitude},{' '}
                {feature.attributes.coordinates.latitude}
              </p>
              <a href={feature.links.url} className="external-link">
                External URL
              </a>
              <button
                onClick={() => handleAddComment(feature.id)}
                className="add-comment-btn"
              >
                Add Comment
              </button>
            </div>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={page === currentPage}
                className={`pagination-btn ${
                  page === currentPage ? 'active' : ''
                }`}
              >
                {page}
              </button>
            )
          )}
          {totalPages > 5 && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="pagination-btn"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {isCommentModalOpen && (
          <CommentModal
          featureId={selectedFeatureId}
          onClose={() => setIsCommentModalOpen(false)}
          onCommentSubmit={(featureId) => {
            setIsCommentModalOpen(false);
            // Lógica para enviar el comentario al API correcto
            axios.post(`/api/features/${featureId}/comments`, { featureId, commentBody })
              
              .catch(error => {
                console.error('Error adding comment:', error);
              });
            setCommentBody(''); // Limpiar el cuerpo del comentario después de enviarlo
          }}
          commentBody={commentBody} // Pasar el estado del cuerpo del comentario al modal
          onCommentInputChange={handleCommentInputChange} 
        />
        
      )}
    </div>
  );
};

export default EarthquakeApp;
