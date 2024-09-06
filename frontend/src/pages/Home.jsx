import React from 'react';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts, deletePost, getUserData } from "../services/api";
import Notification from '../components/Notification.jsx';
import EditPost from "./EditPost.jsx";
import { Button, Card, Spinner, Container, Row, Col } from 'react-bootstrap';
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';

// componente home con post per eventi
export default function Home({ search, viewMyPosts }) {
  const { loggedIn, author, setLoggedIn, setAuthor } = useAuth();
  const [posts, setPosts] = useState([]);
  const [notification, setNotification] = useState(null);
  const [editPostId, setEditPostId] = useState(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // recupero dei post
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getPosts();
        setPosts(response.data);
        
        if (loggedIn) {
          const userData = await getUserData();
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
        if (error.response && error.response.status === 401) {
          setLoggedIn(false);
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [loggedIn, navigate, setLoggedIn]);

  // funzione per eliminare post
  const handleDeletePost = async (id, e) => {
    e.preventDefault();
    const confirmDelete = window.confirm('Are you sure?');
    if (confirmDelete) {
      try {
        await deletePost(id);
        setPosts(posts.filter((post) => post._id !== id));
        setNotification("Post eliminato!");
      } catch (error) {
        console.error('Errore eliminazione post', error);
        setNotification("Errore nella cancellazione del post");
      }
    }
  };

  // funzione per modificare post
  const handleEditPost = (id, e) => {
    e.preventDefault();
    setEditPostId(id);
  };

  // funzione per chiusura modal di modifica
  const handleCloseEditModal = () => {
    setEditPostId(null);
  };

  // funzione per aggiornare post
  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => prevPosts.map(post => post._id === updatedPost._id ? updatedPost : post));
    setNotification("Post modificato!");
    setEditPostId(null);
  };

  if (isLoading) {
    return <div className="ms-4"><Spinner animation="border" role="status" /></div>;
  }

  // filtro dei post
  const filterPosts = (posts) => {
    let filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    );
    
    if (viewMyPosts && currentUser) {
      filtered = filtered.filter(post => post.author === currentUser.email);
    }
    
    return filtered;
  };

  return (
    <>
    <div className="relative overflow-hidden bg-light min-vh-100">
      <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
      </div>
      <Container className="d-flex flex-column align-items-center justify-content-center p-4" style={{ zIndex: 10 }}>
        <h1 className="mb-6 text-4xl font-extrabold text-dark shadow-lg">{viewMyPosts ? "My Posts" : "Events"}</h1>
        {notification && (
          <Notification message={notification} onClose={() => setNotification(null)} />
        )}
        <Row className="g-4">
          {filterPosts(posts).map((post) => (
            <Col sm={6} md={4} lg={3} key={post._id}>
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)" }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden rounded-lg bg-white text-black"
              >
                <Link to={`/post/${post._id}`} className="text-decoration-none">
                  <Card className="h-100">
                    <Card.Img variant="top" src={post.cover} alt={post.title} className="h-48 object-cover" />
                    <Card.Body>
                      <Card.Title className="text-dark">{post.title}</Card.Title>
                      <Card.Text className="text-muted">
                        Autore: {post.author}
                      </Card.Text>
                      {loggedIn && currentUser && currentUser.email === post.author && (
                        <div className="d-flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline-success" 
                            className="flex-grow-1"
                            onClick={(e) => handleEditPost(post._id, e)}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-danger" 
                            className="flex-grow-1"
                            onClick={(e) => handleDeletePost(post._id, e)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Link>
                {editPostId && <EditPost postId={editPostId} onUpdate={handlePostUpdate} onClose={handleCloseEditModal} />}
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
    </>
  );
}
