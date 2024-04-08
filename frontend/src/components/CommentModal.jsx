import React, { useState } from 'react';
import axios from 'axios';

const CommentModal = ({ featureId, onClose, onCommentSubmit }) => {
  const [commentBody, setCommentBody] = useState('');

  const handleCommentSubmit = async () => {
    try {
      await axios.post('/api/features', {
        feature_id: featureId,
        body: commentBody,
      });
      onCommentSubmit();
      onClose();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>Add Comment</h3>
        <textarea
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          className="comment-textarea"
        />
        <button onClick={handleCommentSubmit} className="submit-comment-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default CommentModal;