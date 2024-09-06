// Importo i componenti necessari da react-router-dom per gestire il routing
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importo il componente Login
import Login from "./pages/Login";

// Importo il componente Register
import Register from "./pages/Register";

// importo il componente UmbrellaManager
import UmbrellaManager from "./components/UmbrellaManager";

// Importo il componente CreateUmbrella
import CreateUmbrella from "./components/CreateUmbrella";

//import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importo i componenti personalizzati dell'applicazione;
import "./App.css";
import React from "react";

//importo i providers
import { UmbrellaProvider } from './contexts/UmbrellaContext';
import { BookingProvider } from './contexts/BookingContext';
import { AuthProvider } from "./contexts/AuthContext";
//importo ProtectedRoute e useState
import { useState } from "react";
import ProtectedRoute from './components/ProtectedRoute';

// Importo i componenti necessari per gestire il routing
import NavbarComponent from "./components/NavbarComponent";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import EditPost from "./pages/EditPost";
import PostDetail from "./pages/PostDetail";
//import UserList from "./pages/UserList";
import NotFound from "./pages/NotFound";
import BookingStats from "./components/BookingStats";

// Definisco il componente principale App
function App() {
  const [search, setSearch] = useState("");
  const [viewMyPosts, setViewMyPosts] = useState(false);
  return (
    // Router avvolge l'intera applicazione, abilitando il routing
    <Router>
      <AuthProvider>
      <UmbrellaProvider>
        <BookingProvider>
        <NavbarComponent />
        <main>
          {/* definisce le diverse rotte dell'applicazione */}
          <Routes>
          {/* Route per la home page */}
            <Route path="/" element={<Home 
                                      viewMyPosts={viewMyPosts} 
                                      search={search} 
                                      setSearch={setSearch}/>} 
                                      />

            {/* Route per la pagina di creazione di un nuovo post */}
            <Route path="/create" element={<CreatePost />} />

            {/* Route per la pagina di dettaglio di un post
                :id è un parametro dinamico che rappresenta l'ID del post */}
            <Route path="/post/:id" element={<PostDetail />} /> 
            <Route path="/edit/:id" element={<EditPost  />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<ProtectedRoute element={Register} adminOnly />}/>
            {/*<Route path="/users" element={<ProtectedRoute element={UserList} adminOnly />}/>*/}
            {/* Rotte per la gestione degli ombrelloni */}
            <Route path="/umbrellas" element={<UmbrellaManager />} />
            <Route path="/bookings/status" element={<BookingStats />} />
            <Route path="/create-umbrella" element={<CreateUmbrella />} /> {/* Rotta per creare un nuovo ombrellone */}
            {/* Rotta per la navigazione alla pagina 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        </BookingProvider>
        </UmbrellaProvider>
        </AuthProvider>
    </Router>
  );
}

// Esporto il componente App come default per essere utilizzato in altri file
export default App;

