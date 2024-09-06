import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

//strategia di autenticazione Google
passport.use(
    new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback"
        },
        // se l'autenticazione avviene con successo, viene chiamata questa funzione
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Cerca se l'utente esiste nel database
                let user = await User.findOne({ googleId: profile.id }); //profile contiene l'id di google

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        nome: profile.name.givenName,
                        cognome: profile.name.familyName,
                        email: profile.emails[0].value,
                        dataDiNascita: null
                    });
                    // Salva l'utente nel database
                    await user.save();
                }

                // done: passare al prossimo middleware, null: nessun errore, user: l'autore che ho creato
                done(null, user);

            } catch (error) {
                // si passa l'errore a passport
                done(error, null);
            }
        }
    )
);

// serializza l'user in una stringa JSON
//funzione che determina quali dati dell'utente vengono memorizzati nella sessione
passport.serializeUser((user, done) => {
    done(null, user.id); // solo id utente
});  

//deserializza l'user da una stringa JSON: recupero l'intero oggetto oggetto basandomi su l'id
passport.deserializeUser(async (id, done) => {
    try {
        // Cerca l'utente nel database utilizzando l'id
        const user = await Author.findById(id);
        // passo l'autore al middleware passport
        done(null, user);
    } catch (error) {
        console.error("Errore durante la deserializzazione dell'autore:", error);
        // passo l'errore a passport
        done(error, null);
    }
});

export default passport;