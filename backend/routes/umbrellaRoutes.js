import express from "express";
import Umbrella from "../models/Umbrella.js";
//import upload from "../middlewares/upload.js"; // Import nuovo Middleware per upload (NO CLOUDINARY)
import cloudinaryUploader from "../config/claudinaryConfig.js"; // Import dell'uploader di Cloudinary (CON CLOUDINARY)
import upload from '../middlewares/upload.js';

// import controlloMail from "../middlewares/controlloMail.js"; // NON USARE - SOLO PER DIDATTICA - MIDDLEWARE (commentato)

const router = express.Router();

// router.use(controlloMail); // NON USARE - SOLO PER DIDATTICA - Applicazione del middleware a tutte le rotte (commentato)

// GET /umbrella: ritorna una lista di ombrelloni
router.get("/", async (req, res) => {
  try {
    const umbrellas = await Umbrella.find({});
    //console.log('Umbrellas:', umbrellas);
    // Calcola lo stato corrente per ogni ombrellone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    //console.log('Today:', today);

    const umbrellaStatusList = umbrellas.map(umbrella => {
      if (!Array.isArray(umbrella.bookings)) {
        return {
          ...umbrella.toObject(),
          currentStatus: 'libero'
        };
      }
      const hasBookingToday = umbrella.bookings.some(booking => {
        const startDate = new Date(booking.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(booking.endDate);
        endDate.setHours(23, 59, 59, 999);

        //console.log('Checking booking:', booking);
        return today >= startDate && today <= endDate;
      });

      return {
        ...umbrella.toObject(),
        currentStatus: hasBookingToday ? 'occupato' : 'libero'
      };
    });

    //console.log('Umbrella Status List:', umbrellaStatusList);

    // Invia la lista degli ombrelloni come risposta JSON
    res.json(umbrellaStatusList);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// GET /umbrella/123: ritorna un singolo ombrellone
router.get("/:id", async (req, res) => {
  try {
    // Cerca un ombrellone specifico per ID
    const umbrella = await Umbrella.findById(req.params.id);
    if (!umbrella) {
      // Se l'ombrellone non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Ombrellone non trovato" });
    }
    // Calcola lo stato corrente dell'ombrellone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasBookingToday = umbrella.bookings.some(booking => {
      const startDate = new Date(booking.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(booking.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      return today >= startDate && today <= endDate;
    });

    const umbrellaWithStatus = {
      ...umbrella.toObject(),
      currentStatus: hasBookingToday ? 'occupato' : 'libero'
    };

    // Invia l'ombrellone trovato come risposta JSON
    res.json(umbrellaWithStatus);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});


// POST /umbrella: crea un nuovo ombrellone

router.post("/", cloudinaryUploader.single("image"), async (req, res) => {
  try {
    //console.log('Dati ricevuti:', req.body);
    //console.log('File caricato:', req.file);
    
    // Converti i campi in tipi di dato corretti
    const umbrella = {
      number: req.body.number,
      tipology: req.body.tipology,
      row: req.body.row,
      isAccessible: req.body.isAccessible === 'true',  // Converti la stringa 'true' o 'false' in booleano
      price: parseFloat(req.body.price),  // Converti la stringa in numero
    };
    if (req.file) {
      umbrella.image = req.file.path;
    }
    
    const newUmbrella = new Umbrella(umbrella);
    await newUmbrella.save();
    res.status(201).json(newUmbrella);
  } catch (error) {
    console.error('Errore nella creazione dell\'ombrellone:', error);
    res.status(400).json({ message: error.message });
  }
});



// PUT /umbrella/123: modifica l'ombrellone con l'id associato
router.put("/:id", async (req, res) => {
  try {
    // Trova e aggiorna l'ombrellone nel database
    const updatedUmbrella = await Umbrella.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Opzione per restituire il documento aggiornato
    );
    if (!updatedUmbrella) {
      // Se l'ombrellone non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Ombrellone non trovato" });
    }
    // Invia l'ombrellone aggiornato come risposta JSON
    res.json(updatedUmbrella);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(400).json({ message: err.message });
  }
});

// PATCH /umbrella/:id: aggiorna parzialmente l'ombrellone con l'id associato
router.patch("/:id", cloudinaryUploader.single('image'), async (req, res) => {
  try {
    const updateData = {};
    if (req.body.number) updateData.number = req.body.number;
    if (req.body.tipology) updateData.tipology = req.body.tipology;
    if (req.body.row) updateData.row = req.body.row;
    if (req.body.isAccessible !== undefined) updateData.isAccessible = req.body.isAccessible;
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.price) updateData.price = req.body.price;

    if (req.file) {
      updateData.image = req.file.path;
    }

    const umbrella = await Umbrella.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!umbrella) {
      return res.status(404).json({ message: "Ombrellone non trovato" });
    }

    res.json(umbrella);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// DELETE /umbrella/123: cancella l'ombrellone con l'id associato
router.delete("/:id", async (req, res) => {
  try {
    console.log("Tentativo di eliminazione dell'ombrellone con ID:", req.params.id);
    const deletedUmbrella = await Umbrella.findByIdAndDelete(req.params.id);
    if (!deletedUmbrella) {
      console.log("Ombrellone non trovato.");
      return res.status(404).json({ message: "Ombrellone non trovato" });
    }

    // Verifica se l'ombrellone ha un'immagine associata
    if (deletedUmbrella.image) {
      // Estrai l'public_id da Cloudinary dall'URL della cover
      const publicId = `umbrella_covers/${deletedUmbrella.image.split('/').pop().split('.')[0]}`;
      console.log("Public ID estratto per Cloudinary:", publicId);

      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Risultato eliminazione Cloudinary:", result);
      } catch (cloudinaryError) {
        console.error("Errore durante l'eliminazione dell'immagine da Cloudinary:", cloudinaryError);
      }
    } else {
      console.log("Nessuna immagine associata all'ombrellone da eliminare.");
    }

    res.json({ message: "Ombrellone eliminato" });
  } catch (err) {
    console.error("Errore del server durante l'eliminazione:", err);
    res.status(500).json({ message: err.message });
  }
});


// GET /umbrella/:id/bookings: ottiene tutte le prenotazioni per un ombrellone specifico
router.get("/:id/bookings", async (req, res) => {
  try {
    const umbrella = await Umbrella.findById(req.params.id);
    if (!umbrella) {
      return res.status(404).json({ message: "Ombrellone non trovato" });
    }
    res.json(umbrella.bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// POST /umbrella/:id/booking: crea una nuova prenotazione per l'ombrellone specificato
router.post("/:id/booking", async (req, res) => {
  try {
    const umbrella = await Umbrella.findById(req.params.id);
    if (!umbrella) {
      return res.status(404).json({ message: "Ombrellone non trovato" });
    }

    const { startDate, endDate, additionalServices = {}, price, deposit = 0, notes = '' } = req.body;
    const sunbeds = additionalServices.sunbeds || 0;
    const sunbedsPrice = sunbeds * 5;  // Assumi 5 euro per lettino

  

    // Calcola il prezzo totale
    const totalPrice = price + sunbedsPrice;
    const balance = totalPrice - deposit;

    // Crea una nuova prenotazione
    const newBooking = {
      customer: req.body.customer,
      startDate,
      endDate,
      price: parseFloat(price),
      totalPrice: parseFloat(totalPrice), // Prezzo totale
      deposit: parseFloat(deposit),
      balance: parseFloat(balance),
      status: req.body.status || 'riservato',
      additionalServices: { sunbeds },
      additionalServicesPrice: { sunbeds: sunbedsPrice },
      notes,
    };

    // Aggiungi la nuova prenotazione all'array
    umbrella.bookings.push(newBooking);

    // Salva le modifiche
    await umbrella.save();
    // console.log('Request Body:', req.body);
    // console.log('Calculated Sunbeds Price:', sunbedsPrice);
    // console.log('Total Price Calculation:', price, '+', sunbedsPrice, '=', totalPrice);
    // console.log('New Booking:', newBooking);

    // Rispondi con l'ombrellone aggiornato
    res.status(201).json(umbrella);
  } catch (error) {
    console.error('Errore durante la creazione della prenotazione:', error.message);
    res.status(400).json({ message: error.message });
  }
});




//creo rotta della prenotazione specifica del singolo ombrellone
router.get("/:id/bookings/:bookingId", async (req, res) => {
  try {
    const umbrella = await Umbrella.findById(req.params.id);
    if (!umbrella) {
      return res.status(404).json({message: "Ombrellone non trovato"});
    };
    const booking = umbrella.bookings.id(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({message: "Prenotazione non trovata"});
    };
    res.json(booking);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

router.patch("/:id/bookings/:bookingId", async (req, res) => {
  try {
    const umbrella = await Umbrella.findById(req.params.id);
    if (!umbrella) {
      return res.status(404).json({ message: "Ombrellone non trovato" });
    }

    const booking = umbrella.bookings.id(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Prenotazione non trovata" });
    }

    // Aggiorna i campi della prenotazione
    Object.assign(booking, req.body);

    // Ricalcola il prezzo totale se necessario
    if (req.body.price !== undefined || req.body.additionalServices) {
      const sunbedsQuantity = req.body.additionalServices?.sunbeds || booking.additionalServices.sunbeds;
      const sunbedsPrice = sunbedsQuantity * 5;
      booking.totalPrice = (req.body.price !== undefined ? req.body.price : booking.price) + sunbedsPrice;
      booking.additionalServices.sunbeds = sunbedsQuantity;
      booking.additionalServicesPrice.sunbeds = sunbedsPrice;
    }

    await umbrella.save();

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// DELETE /umbrella/:id/bookings/:bookingId: cancella una prenotazione specifica
router.delete("/:id/bookings/:bookingId", async (req, res) => {
  try {
    const umbrella = await Umbrella.findById(req.params.id);
    if (!umbrella) {
      return res.status(404).json({ message: "Ombrellone non trovato" });
    }

    const booking = umbrella.bookings.id(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Prenotazione non trovata" });
    }

    umbrella.bookings.pull({ _id: req.params.bookingId});
    await umbrella.save();

    res.json({ umbrella, message: "Prenotazione cancellata" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;
