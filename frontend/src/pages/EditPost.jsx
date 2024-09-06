import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPost, patchPost } from '../services/api';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

// Funzione che gestisce l'aggiornamento di un post
export default function EditPost({ postId, onClose, onUpdate }) {
  const { loggedIn } = useAuth();
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [editCoverFile, setEditCoverFile] = useState(null);
  const [editPost, setEditPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 1, unit: "minutes" },
    author: "",
  });

  // Funzione per recuperare il singolo post
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        console.log('ID del post non trovato');
        return;
      }
      try {
        const response = await getPost(postId);
        setEditPost(response.data);
      } catch (error) {
        console.error('Errore nel recupero del post:', error);
      }
    };
    fetchPost();
  }, [postId]);

  // Funzione per modificare i dati del post
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setEditPost((prev) => ({
        ...prev,
        readTime: { ...prev.readTime, value: parseInt(value) },
      }));
    } else {
      setEditPost((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Funzione per modificare il file di copertina
  const handleEditFileChange = (e) => {
    setEditCoverFile(e.target.files[0]);
  };

  // Funzione per aggiornare il post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('category', editPost.category);
      formData.append('title', editPost.title);
      formData.append('author', editPost.author);
      formData.append('content', editPost.content);
      formData.append('readTime.value', editPost.readTime.value.toString());
      formData.append('readTime.unit', editPost.readTime.unit);

      if (editCoverFile) {
        formData.append('cover', editCoverFile);
      }

      const response = await patchPost(postId, formData);
      setMessage('Post aggiornato con successo');
      onUpdate(response.data); 
      setTimeout(() => {
        onClose();
        navigate('/'); // Naviga solo dopo che il post è stato aggiornato
      }, 1000);
    } catch (error) {
      console.error('Errore nell\'aggiornamento del post:', error);
      setMessage('Errore nell\'aggiornamento del post');
    }
  };

  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={editPost.title}
              onChange={handleEditChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="category" className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={editPost.category}
              onChange={handleEditChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="content" className="mb-3">
            <Form.Label>Contenuto</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              value={editPost.content}
              onChange={handleEditChange}
              required
              rows={6}
            />
          </Form.Group>

          <Form.Group controlId="cover" className="mb-3">
            <Form.Label>Immagine di copertina</Form.Label>
            <Form.Control
              type="file"
              name="cover"
              onChange={handleEditFileChange}
            />
          </Form.Group>

          <Form.Group controlId="readTimeValue" className="mb-3">
            <Form.Label>Tempo di lettura (minuti)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="readTimeValue"
              value={editPost.readTime.value}
              onChange={handleEditChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="author" className="mb-3">
            <Form.Label>Email autore</Form.Label>
            <Form.Control
              type="email"
              name="author"
              value={editPost.author}
              onChange={handleEditChange}
              required
            />
          </Form.Group>

          {message && <Alert variant={message.includes('successo') ? 'success' : 'danger'}>{message}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
