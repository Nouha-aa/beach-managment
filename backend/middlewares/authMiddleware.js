import { verifyJWT } from "../utils/jwt.js";
import User from "../models/User.js";

// Middleware per autenticazione
export const authMiddleware = async (req, res, next) => {
    try {
        // estrae il token dal header della authorization
        // L'operatore ?. (optional chaining) previene errori se authorization è undefined
        // replace('Bearer ', '') rimuove il prefisso 'Bearer ' dal token
        const token = req.headers.authorization?.replace("Bearer ", "");

        //se il token non esiste o non è valido restituisce errore 401 (unauthorized)
        if (!token) {
            return res.status(401).send("token mancante");
        }

        //verifica il token con la funzione verifyJWT
        // se token valido decoded conterrà il payload del token
        const decoded = await verifyJWT(token);

        // usa id di User dal token per cercare l'User nel database
        // .select('-password') esclude il campo password dal risultato
        const user = await User.findById(decoded.id);

        // se l'User non viene trovato restituisce errore 401 (unauthorized)
        if (!user) {
            return res.status(401).send("User non trovato");
        }

        // aggiunge l'User all'oggetto req
        req.user = user;
         // passa al prossimo middleware
         next();
    } catch (error) {
        // se token non valido restituisce errore 401 (unauthorized)
        res.status(401).send("token non valido");
    }
};