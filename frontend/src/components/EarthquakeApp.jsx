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
    // eslint-disable-next-line
    fetchFeatures();
    // eslint-disable-next-line
  }, [currentPage, filters]);


  //Realiza una solicitud a una API para obtener las features, aplica algunos filtros y paginación,
  //y actualiza el estado de la aplicación con los datos obtenidos de la respuesta del servidor.

  const fetchFeatures = async () => {
    try {
      const response = await axios.get('/api/features', {
        params: {
          filters: {
            ...filters
          },
          page: currentPage,
          mag_type: Object.keys(filters).filter(key => filters[key]) // Filtrar por mag_type seleccionado
        },
      });
      setFeatures(response.data.data);
      setTotalPages(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  // Cambia el estado de los filtros en la aplicación cuando se activan o desactivan, y también establece 
  // la página actual en 1 para mostrar los resultados actualizados después de cambiar los filtros.

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

  //Iniciar el proceso para agregar un comentario a una característica específica

  const handleAddComment = (featureId) => {
    setSelectedFeatureId(featureId);
    setIsCommentModalOpen(true);
  };

  //Manejar cambios en el contenido del comentario mientras el usuario escribe en 
  //el área de texto de la ventana modal

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
              onCommentSubmit={() => {
              setIsCommentModalOpen(false);
              // Lógica para enviar el comentario al API correcto
              axios.post(`/api/features/${selectedFeatureId}/comments`, { body: commentBody })
              .then(response => {
                console.log('Comment added successfully:', response);
                setCommentBody(''); 
              })
             .catch(error => {
                console.error('Error adding comment:', error);
              });
            }}
            commentBody={commentBody} // Pasar el estado del cuerpo del comentario al modal
            onCommentInputChange={handleCommentInputChange} 
          />
        )}
    </div>
  );
};

export default EarthquakeApp;
