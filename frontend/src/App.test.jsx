import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthProvider } from '../src/contexts/AuthContext';
import { UmbrellaProvider } from './contexts/UmbrellaContext';
import { BookingProvider } from './contexts/BookingContext';
import * as api from './services/api';
import { getPost, patchPost } from './services/api';
import { vi } from 'vitest';

import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import EditPost from './pages/EditPost';
import BookingModal from './components/BookingModal';


vi.mock('./services/api');


// test del componente Home
describe('Home Component', () => {
  it('renders loading spinner while fetching data', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Home search="" viewMyPosts={false} />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});


// test del componente PostDetail
describe('PostDetail Component', () => {
  beforeEach(() => {
    // Imposto il token nel localStorage prima di ogni test
    localStorage.setItem('token', 'mockToken');
  });

  afterEach(() => {
    // Pulisco il token e i mock dopo ogni test
    localStorage.removeItem('token');
    vi.clearAllMocks();
  });

  // renderizzare post dettagli correttamente
  it('renders post details correctly', async () => {
    // Mock della risposta della funzione getPost
    const mockPost = {
      id: '1',
      title: 'Test Post',
      cover: 'cover.jpg',
      author: 'John Doe',
      category: 'Tech',
      readTime: { value: 5, unit: 'minutes' },
      content: '<p>This is a test post content.</p>',
    };

    api.getPost.mockResolvedValueOnce({ data: mockPost });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    // Navigo alla rotta del post
    window.history.pushState({}, 'Post Detail', '/post/1');
  });


  // mostro un messaggio di caricamento in corso quando il post non viene trovato
  it('shows a loading spinner while fetching data', async () => {
    // Simulo un caricamento del post senza risposta
    api.getPost.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    // Navigo alla rotta del post
    window.history.pushState({}, 'Post Detail', '/post/1');

    // Verifico che lo spinner di caricamento sia presente
    expect(screen.getByLabelText('Caricamento in corso')).toBeInTheDocument();
  });


  // mostro un messaggio di errore quando il post non viene trovato
  it('shows an error message if fetching the post fails', async () => {
    // Simulo la funzione getPost per restituire un errore
    api.getPost.mockRejectedValueOnce(new Error('Errore durante il caricamento del post'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    // Navigo alla rotta del post
    window.history.pushState({}, 'Post Detail', '/post/1');

    // Verifico che lo spinner di caricamento sia presente
    await waitFor(() => {
      expect(screen.getByLabelText('Caricamento in corso')).toBeInTheDocument();
    });
  });
});


// test del componente Login
describe('Login Component', () => {
  beforeEach(() => {
    // Resetto i dati di login prima di ogni test
    localStorage.removeItem('token');
  });

  // renderizza il componente Login
  it('renders the login form correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });


  // verifico che venga visualizzato un messaggio di errore quando il login fallisce
  it('displays an error message when login fails', async () => {
    // Mock della funzione login per restituire un errore
    const mockLogin = vi.fn().mockRejectedValueOnce(new Error('Login fallito'));

    render(
      <BrowserRouter>
        <AuthProvider value={{ login: mockLogin }}>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    // Compilo il modulo di login
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Verifico che venga visualizzato un messaggio di errore
    await waitFor(() => {
      expect(screen.getByText(/Login fallito/i)).toBeInTheDocument();
    });
  });

  it('displays a success message when login is successful', async () => {
    // Mock della funzione login per restituire un valore di successo
    const mockLogin = vi.fn().mockResolvedValueOnce({ token: 'mockToken' });

    render(
      <BrowserRouter>
        <AuthProvider value={{ login: mockLogin }}>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    // Compilo il modulo di login
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  });
});


// test del componente EditPost
describe('EditPost Component', () => {
  it('renders the edit post form correctly', async () => {
    const mockPost = {
      id: '1',
      title: 'Test Post',
      category: 'Tech',
      content: 'This is a test post content.',
      readTime: { value: 5, unit: 'minutes' },
      author: 'test@example.com',
    };

    getPost.mockResolvedValueOnce({ data: mockPost });

    render(
      <BrowserRouter>
        <AuthProvider>
          <EditPost postId="1" onClose={vi.fn()} onUpdate={vi.fn()} />
        </AuthProvider>
      </BrowserRouter>
    );

    // Verifico che i campi del modulo siano popolati correttamente
    await waitFor(() => {
      expect(screen.getByLabelText(/Titolo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Contenuto/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Tempo di lettura \(minuti\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email autore/i)).toBeInTheDocument();
    });
  });

  // testo l'aggiornamento del post
  it('updates the post successfully', async () => {
    const mockUpdatedPost = {
      id: '1',
      title: 'Updated Test Post',
      category: 'Updated Tech',
      content: 'Updated test post content.',
      readTime: { value: 10, unit: 'minutes' },
      author: 'updated@example.com',
    };

    patchPost.mockResolvedValueOnce({ data: mockUpdatedPost });

    const onCloseMock = vi.fn();
    const onUpdateMock = vi.fn();

    render(
      <BrowserRouter>
        <AuthProvider>
          <EditPost postId="1" onClose={onCloseMock} onUpdate={onUpdateMock} />
        </AuthProvider>
      </BrowserRouter>
    );

    // Compilo il modulo con i nuovi valori
    fireEvent.change(screen.getByLabelText(/Titolo/i), { target: { value: 'Updated Test Post' } });
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: 'Updated Tech' } });
    fireEvent.change(screen.getByLabelText(/Contenuto/i), { target: { value: 'Updated test post content.' } });
    fireEvent.change(screen.getByLabelText(/Tempo di lettura \(minuti\)/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Email autore/i), { target: { value: 'updated@example.com' } });

    // Simulo l'invio del modulo
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    // Verifico che la funzione onUpdate sia chiamata con i dati aggiornati
    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalledWith(mockUpdatedPost);
    });

    // Verifico che la funzione onClose sia chiamata
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    }, { timeout: 2000 }); // Aumenta il timeout se necessario
  });

  // testo il caso in cui l'aggiornamento del post fallisce
  it('displays an error message when updating the post fails', async () => {
    patchPost.mockRejectedValueOnce(new Error('Update failed'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <EditPost postId="1" onClose={vi.fn()} onUpdate={vi.fn()} />
        </AuthProvider>
      </BrowserRouter>
    );

    // Simulo l'invio del modulo
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    // Verifico che venga visualizzato un messaggio di errore
    await waitFor(() => {
      expect(screen.getByText(/Errore nell'aggiornamento del post/i)).toBeInTheDocument();
    });
  });
});


// test booking modal, mock del booking context e umbrella context
const mockBookingContext = {
  updateBooking: vi.fn(),
  bookings: [],
  checkOverlap: vi.fn(),
  deleteBooking: vi.fn(),
};

const mockUmbrellaContext = {
  umbrellas: [],
};

// Mock delle funzioni di utility
vi.mock('../utils/dateUtils', () => ({
  formatDateToEuropean: vi.fn(date => date),
  parseEuropeanDate: vi.fn(date => date),
}));

// test booking modal
describe('BookingModal', () => {
  const defaultProps = {
    show: true,
    onHide: vi.fn(),
    umbrellaId: '1',
    umbrellaPrice: 100,
    onBookingUpdated: vi.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(
      <BookingProvider value={mockBookingContext}>
        <UmbrellaProvider value={mockUmbrellaContext}>
          <BookingModal {...defaultProps} {...props} />
        </UmbrellaProvider>
      </BookingProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // renderizza il componente BookingModal correttamente
  test('renders correctly with default props', () => {
    renderComponent();
    expect(screen.getByText('Nuova Prenotazione')).toBeInTheDocument();
  });

  // renderizzo il componente BookingModal con i dati della prenotazione esistenti
  test('renders correctly when editing an existing booking', async () => {
    const booking = {
      _id: '123',
      customer: { name: 'John Doe', phone: '1234567890', email: 'john@example.com' },
      startDate: '2024-09-10',
      endDate: '2024-09-15',
      price: 150,
      deposit: 50,
      additionalServices: { sunbeds: 2 },
      notes: 'Test notes',
    };
    renderComponent({ booking });
    
    // Attendo che il componente si aggiorni con i dati della prenotazione
    await waitFor(() => {
      expect(screen.getByText('Modifica Prenotazione')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('150')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test notes')).toBeInTheDocument();
    });
  });
});