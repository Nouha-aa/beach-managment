import express from "express";
import BlogPost from "../models/BlogPost.js";
import cloudinaryUploader from "../config/claudinaryConfig.js"; // Import dell'uploader di Cloudinary (CON CLOUDINARY)
import { sendEmail } from "../services/emailService.js"; // Import del codice per l'invio delle mail (INVIO MAIL)
//import middleware per proteggere le rotte
import {authMiddleware} from "../middlewares/authMiddleware.js";
import upload from '../middlewares/upload.js';


const router = express.Router();



// GET /blogPosts: ritorna una lista di blog post
router.get("/", async (req, res) => {
  try {
    let query = {};
    // Se c'è un parametro 'title' nella query, crea un filtro per la ricerca case-insensitive
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" }; // Per fare ricerca case-insensitive:
      // Altrimenti per fare ricerca case-sensitive -> query.title = req.query.title;
    }
    // Cerca i blog post nel database usando il filtro (se presente)
    const blogPosts = await BlogPost.find(query);
    // Invia la lista dei blog post come risposta JSON
    res.json(blogPosts);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// GET /blogPosts/123: ritorna un singolo blog post
router.get("/:id", async (req, res) => {
  try {
    // Cerca un blog post specifico per ID
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    // Invia il blog post trovato come risposta JSON
    res.json(blogPost);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});


// router.post("/", upload.single("cover"), async (req, res) => {
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    const postData = req.body;
    if (req.file) {
      // postData.cover = `http://localhost:5001/uploads/${req.file.filename}`;
      postData.cover = req.file.path; // Cloudinary restituirà direttamente il suo url
    }
    const newPost = new BlogPost(postData);
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});


// PUT /blogPosts/123: modifica il blog post con l'id associato
router.put("/:id", async (req, res) => {
  try {
    // Trova e aggiorna il blog post nel database
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Opzione per restituire il documento aggiornato
    );
    if (!updatedBlogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    // Invia il blog post aggiornato come risposta JSON
    res.json(updatedBlogPost);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(400).json({ message: err.message });
  }
});

//creo una patch per modificare i post con l'id associato
router.patch("/:id", upload.single('cover'), async (req, res) => {
  console.log("Received PATCH request for post ID:", req.params.id);
  console.log("Request body:", req.body);

  try {
    const updateData = {};

    // Aggiungi solo i campi presenti nel corpo della richiesta
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.author) updateData.author = req.body.author;
    if (req.body.content) updateData.content = req.body.content;
    
    // Gestione del readTime
    if (req.body.readTime) {
      updateData.readTime = {};
      if (req.body['readTime.value']) updateData.readTime.value = parseInt(req.body['readTime.value']);
      if (req.body['readTime.unit']) updateData.readTime.unit = req.body['readTime.unit'];
    }

    // Se c'è un nuovo file di copertina, gestiscilo qui
    if (req.file) {
      updateData.cover = req.file.path;
    }

    console.log("Update data:", updateData);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nessun dato valido fornito per l'aggiornamento" });
    }

    const blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    // Invia il blog post aggiornato come risposta JSON
    res.json(blogPost);
  } catch (error) {
    console.error("Error updating post:", error);
    // In caso di errore, invia una risposta di errore
    res.status(400).json({ message: error.message });
  }
});

// PATCH /blogPosts/:blogPostId/cover: carica un'immagine di copertina per il post specificato
router.patch("/:blogPostId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    // Verifica se è stato caricato un file o meno
    if (!req.file) {
      return res.status(400).json({ message: "Ops, nessun file caricato" });
    }

    // Cerca il blog post nel db
    const blogPost = await BlogPost.findById(req.params.blogPostId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }

    // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
    blogPost.cover = req.file.path;

    // Salva le modifiche nel db
    await blogPost.save();

    // Invia la risposta con il blog post aggiornato
    res.json(blogPost);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della copertina:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// DELETE /blogPosts/123: cancella il blog post con l'id associato
router.delete("/:id", async (req, res) => {
  try {
    // Trova e elimina il blog post dal database
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    // Invia un messaggio di conferma come risposta JSON
    res.json({ message: "Blog post eliminato" });
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

export default router;