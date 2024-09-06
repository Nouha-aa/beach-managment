import express from "express";
import User from "../models/User.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/adminConfig.js';
//import passport from "../config/passportConfig.js";
import bcrypt from "bcrypt";
const router = express.Router(); // creo un router per le rotte

// POST /auth/login: effettua il login, sia admin che user
router.post("/login", async (req, res) => {
    console.log("Dati ricevuti dal server:", req.body);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("Utente non trovato per l'email:", email);
            return res.status(401).json({ message: "Utente non trovato" });
        }

        console.log("Utente trovato:", user.email);
        const isMatch = await user.comparePassword(password);
        console.log("Risultato del confronto password:", isMatch);
        
        if (!isMatch) {
            console.log("Password non corrispondente per l'utente:", email);
            return res.status(401).json({ message: "Password non valida" });
        }

        const token = await generateJWT({ id: user._id, isAdmin: user.isAdmin });
        console.log("Login riuscito per l'utente:", email);
        res.json({ 
            token, 
            message: "Login effettuato con successo", 
            isAdmin: user.isAdmin,
            user: {
                id: user._id,
                nome: user.nome,
                cognome: user.cognome,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error("Errore durante il login:", error); 
        res.status(500).json({ message: "Errore del server", error: error.message });
    }
});

// POST /auth/register: registra un nuovo utente ma solo con il permesso (password) dell'admin
router.post("/register", authMiddleware, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Solo gli admin possono registrare nuovi utenti" });
        }

        const { nome, cognome, email, password, adminPassword } = req.body;

        console.log("Admin Password ricevuta dal client:", adminPassword);
        console.log("Password hashata dell'admin loggato:", req.user.password);

        if (!nome || !cognome || !email || !password || !adminPassword) {
            return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
        }

        const isPasswordValid = await bcrypt.compare(adminPassword, req.user.password);
        
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Password admin non valida" });
        }

        const user = new User({ nome, cognome, email, password });
        const newUser = await user.save();

        console.log("Nuovo utente registrato:", newUser.email);

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (err) {
        console.error("Errore durante la registrazione:", err);
        if (err.code === 11000) {
            res.status(400).json({ message: "Email già in uso" });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
});





    // GET /me : restituisce l'utente correntemente loggato
    router.get("/me", authMiddleware, (req, res) => {
        // converte il documento mongoose in un oggetto JavaScript semplice
        const userData = req.user.toObject();
        // rimuove il campo password per sicurezza
        delete userData.password;
        // restituisce l'utente correntemente loggato come risposta JSON
        res.json(userData);
    });

// Create initial admin (da usare una sola volta)
router.post("/create-admin", async (req, res) => {
    try {
        const adminExists = await User.findOne({ email: ADMIN_EMAIL });
        if (adminExists) {
            return res.status(400).json({ message: "Admin già esistente" });
        }

        const admin = new User({
            nome: "Admin",
            cognome: "User",
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            isAdmin: true
        });

        await admin.save();
        res.status(201).json({ message: "Admin creato con successo" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

    export default router;