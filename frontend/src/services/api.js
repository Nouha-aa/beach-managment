import axios from "axios";

// Definisco l'url di base'
const API_URL = "http://localhost:5001/api";

// Configuro un'istanza di axios con l'URL di base
const api = axios.create({
  baseURL: API_URL,
});

// Aggiungo un interceptor per includere il token in tutte le richieste
const getToken = () => localStorage.getItem('token');

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//interceptor per gestire gli errori di autenticazione
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token non valido o scaduto
      logout();
    }
    return Promise.reject(error);
  }
);

// Funzione di login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      throw new Error('Token non ricevuto dal server');
    }
  } catch (error) {
    console.error('Errore durante il login:', error.response?.data || error.message);
    throw error;
  }
};
  
// Funzione per la registrazione
export const register = async (nome, cognome, email, password, adminPassword, token) => {
  const response = await axios.post(`${API_URL}/auth/register`, { 
    nome, cognome, email, password, adminPassword 
  }, {
    headers: {
      Authorization: `Bearer ${token}`, // Aggiungo il token di autenticazione
    }
  });
  return response.data;
};

// Funzioni per le operazioni CRUD di blogPosts
export const getPosts = () => api.get("/blogPosts");
export const getPost = (id) => api.get(`/blogPosts/${id}`);

// Funzione per creare un nuovo blogPost
export const createPost = (postData) =>
  api.post("/blogPosts", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Funzione per aggiornare un blogPost esistente con put o patch
export const updatePost = (id, postData) =>
  api.put(`/blogPosts/${id}`, postData);
export const patchPost = (id, formData) => 
  api.patch(`/blogPosts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

// Funzione per eliminare un blogPost
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// funzione per l'upload dell'immagine di copertina
export const updateBlogPostCover = (blogPostId, coverFile) => {
  const formData = new FormData();
  formData.append('cover', coverFile);

  return api.patch(`/blogPosts/${blogPostId}/cover`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


  // Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () =>
    api.get("/auth/me").then((response) => response.data);
  
  // Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
  export const getUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout();
        throw new Error('Sessione scaduta. Effettua nuovamente il login.');
      }
      console.error('Errore nel recupero dei dati utente:', error);
      throw error;
    }
  };

  // Funzione per ottenere tutti gli utenti
  export const getUsers = async (token) => {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // Includi il token per autenticazione
      },
    });
    return response.data;
  };
  
  // Funzione per l'eliminazione di un utente
  export const deleteUser = async (id, token) => {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  // Funzione per il logout
  export const logout = () => {
    localStorage.removeItem('token');
    // Rimuovi il token dall'header di default di Axios
    delete api.defaults.headers.common['Authorization'];
  };

  // Funzione per l'intera gestione degli ombrelloni
  export const umbrellaApi = {
    // Ottenere tutti gli ombrelloni
    getAllUmbrellas: () => axios.get(`${API_URL}/umbrellas`),
  
    // Ottenere un singolo ombrellone per ID
    getUmbrellaById: (id) => axios.get(`${API_URL}/umbrellas/${id}`),
  
    // Creare un nuovo ombrellone
  createUmbrella: async (umbrellaData) => {
    const formData = new FormData();
    for (const key in umbrellaData) {
      if (umbrellaData.hasOwnProperty(key)) {
        formData.append(key, umbrellaData[key]);
      }
    }
    try {
      const response = await api.post('/umbrellas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response; // Restituisci l'intero oggetto di risposta
    } catch (error) {
      console.error('Errore nella creazione dell\'ombrellone:', error.response?.data || error.message);
      throw error;
    }
  },
  
    // Aggiornare un ombrellone
    updateUmbrella: (id, umbrellaData) => axios.patch(`${API_URL}/umbrellas/${id}`, umbrellaData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
    // Eliminare un ombrellone
    deleteUmbrella: (id) => axios.delete(`${API_URL}/umbrellas/${id}`),
  
    // Ottenere le prenotazioni di un ombrellone
    getUmbrellaBookings: (id) => axios.get(`${API_URL}/umbrellas/${id}/bookings`),
  
    // Creare una nuova prenotazione per un ombrellone
    createBooking: async (umbrellaId, booking) => {
      try {
        const response = await api.post(`/umbrellas/${umbrellaId}/booking`, booking, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        return response.data;
      } catch (error) {
        console.error('Errore durante la richiesta POST:', error.response?.data || error.message);
        throw error;
      }
    },
  
    // Aggiornare una prenotazione
    updateBooking: async (umbrellaId, bookingId, updatedBooking) => {
  try {
    const response = await api.patch(`/umbrellas/${umbrellaId}/bookings/${bookingId}`, updatedBooking, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta PATCH:', error.response?.data || error.message);
    throw error;
  }
},
  
    // Eliminare una prenotazione
    deleteBooking: (umbrellaId, bookingId) => 
      axios.delete(`${API_URL}/umbrellas/${umbrellaId}/bookings/${bookingId}`),
  };
  
  export default api;