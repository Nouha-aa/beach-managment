import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getUserData } from "../services/api";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./CreatePost.css";

// Funzione per creare un nuovo post
export default function CreatePost() {
  const [currentUser, setCurrentUser] = useState(null);

  // Funzione per recuperare i dati dell'utente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        setCurrentUser(userData);
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    };
    fetchUser();
  }, []);

  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 1, unit: "minutes" },
    author: "",
  });

  const [createdMessage, setCreatedMessage] = useState(false);
  const [coverFile, setCoverFile] = useState(null);

  const navigate = useNavigate();

  // Funzione per modificare i dati del post
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  // Funzione per modificare il file di copertina
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Funzione per creare il post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await createPost(formData);
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    } finally {
      setCreatedMessage(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="create-post-page container-fluid p-4">
      <h2 className="testo-card text-3xl font-bold text-center mb-6">Crea Nuovo Evento</h2>
      <Card className="card px-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Titolo:</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Luogo:</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={post.category}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Contenuto:</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={post.content}
                onChange={handleChange}
                required
                rows={6}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="cover">
              <Form.Label>Immagine di copertina:</Form.Label>
              <Form.Control
                type="file"
                name="cover"
                onChange={handleFileChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="readTimeValue">
              <Form.Label>Tempo di lettura (minutes):</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="readTimeValue"
                value={post.readTime.value}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="author">
              <Form.Label>Author Email:</Form.Label>
              <Form.Control
                type="email"
                name="author"
                value={post.author}
                readOnly
                required
              />
            </Form.Group>

            {createdMessage && (
              <Alert variant="success" className="text-center">
                Post created successfully!
              </Alert>
            )}

            <Button type="submit" className="save-button w-50">
              Save Post
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
