import React from 'react';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPost, getUserData } from "../services/api";
import { Card, Spinner, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUser, FaClock, FaTags } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

// Funzione che restituisce il componente PostDetail
export default function PostDetail() {
  const {setLoggedIn} = useAuth();
  const [post, setPost] = useState(null);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();

  // Funzione per recuperare il post e l'utente
  useEffect(() => {
    const fetchPostAndUser = async () => {
      try {
        const response = await getPost(id);
        setPost(response.data);

        const token = localStorage.getItem("token");
        if (token) {
          setLoggedIn(true);
          const userDataResponse = await getUserData();
          setUserData(userDataResponse);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Errore nella fetch del post:", error);
      }
    };

    fetchPostAndUser();
  }, [id, setLoggedIn]);

// nel caso in cui non ci sia un post, mostro un messaggio di caricamento
if (!post) {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner
        animation="border"
        role="status"
        size="xl"
        aria-label="Caricamento in corso"
      />
    </div>
  );
}

  return (
    <Container className="my-4">
      <motion.div
        className="post-detail mx-auto"
        style={{ maxWidth: "768px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Card>
          <Card.Img
            variant="top"
            src={post.cover}
            alt={post.title}
            style={{ objectFit: "cover", height: "16rem" }}
          />
          <Card.Body>
            <Card.Title as="h1" className="mb-4">
              {post.title}
            </Card.Title>
            <div className="post-meta text-muted mb-4">
              <div className="d-flex align-items-center mb-2">
                <FaTags className="me-2" />
                <span>Luogo: {post.category}</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FaUser className="me-2" />
                <span>Autore: {post.author}</span>
              </div>
              <div className="d-flex align-items-center">
                <FaClock className="me-2" />
                <span>Tempo di lettura: {post.readTime.value} {post.readTime.unit}</span>
              </div>
            </div>
            <div
              className="post-content"
              style={{ fontSize: "1.25rem", lineHeight: "1.75" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
}
