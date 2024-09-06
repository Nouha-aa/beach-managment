// Importazione dei moduli necessari
import express from "express"; // Framework web per Node.js
import mongoose from "mongoose"; // ODM per MongoDB
import dotenv from "dotenv"; // Per caricare variabili d'ambiente da file .env
import cors from "cors"; // Middleware per gestire CORS (Cross-Origin Resource Sharing)
import listEndpoints from "express-list-endpoints"; // Utility per elencare gli endpoints dell'app
import userRoutes from "./routes/userRoutes.js"; // Rotte per gli users
import umbrellaRoutes from "./routes/umbrellaRoutes.js"; // Rotte per gli ombrelloni
import blogPostRoutes from "./routes/blogPostRoutes.js"; // Rotte per i blog posts
import path from "path"; // UPLOAD: Modulo per gestire i percorsi dei file
import { fileURLToPath } from "url"; // UPLOAD Per convertire URL in percorsi di file
import authRoutes from "./routes/authRoutes.js"; // Rotte per l'autenticazione


// MIDDLEWARE Importazione dei middleware per la gestione degli errori
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./middlewares/errorHandlers.js";

// UPLOAD: Configurazione per utilizzare __dirname in moduli ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Creazione dell'istanza dell'applicazione Express
const app = express();

// Applicazione dei middleware globali
app.use(cors()); // Abilita CORS per tutte le rotte
app.use(express.json()); // Parsing del corpo delle richieste in formato JSON
app.use(express.urlencoded({ extended: true }));

// Connessione al database MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connesso"))
  .catch((err) => console.error("Errore di connessione MongoDB:", err));

// Definizione delle rotte principali
app.use("/api/auth", authRoutes); // Rotte per l'autenticazione
app.use("/api/users", userRoutes); // Rotte per gli autori
app.use("/api/umbrellas", umbrellaRoutes ); // Rotte per gli ombrelloni
app.use("/api/blogPosts", blogPostRoutes); // Rotte per i blog posts

// Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 3000;

// Applicazione dei middleware per la gestione degli errori
app.use(badRequestHandler); // Gestisce errori 400 Bad Request
app.use(unauthorizedHandler); // Gestisce errori 401 Unauthorized
app.use(notFoundHandler); // Gestisce errori 404 Not Found
app.use(genericErrorHandler); // Gestisce tutti gli altri errori

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);

  // Stampa tutte le rotte disponibili in formato tabellare
  console.log("Rotte disponibili:");
  console.table(
    listEndpoints(app).map((route) => ({
      path: route.path,
      methods: route.methods.join(", "),
    }))
  );
});
