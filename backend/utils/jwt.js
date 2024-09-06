import jwt from "jsonwebtoken";

//funzione per generare un token
export const generateJWT = (payload) => {
    return new Promise((resolve, reject) => {
        // utilizza il metodo sign di jwt per creare un nuovo token
    return jwt.sign(
        payload, // il payload contiene i dati che vogliamo includere nel token
        process.env.JWT_SECRET,  // chiave secreta per cifrare il token
        { expiresIn: "1 day" }, // opzioni: imposta la scadenza del token
        (err, token) => {
            if (err) reject(err); //se errore rifiuta promise
            else resolve(token);// altrimenti restituisce promise con token
        }
    );
 });
};

//funzione che verifica un token JWT
export const verifyJWT = (token) => {
    // restituisce una Promise per effettuare l'oper in modo asincrono
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            // callback che gestisce il risultato dell'operazione
            if (err) reject(err);
            // se errore rifiuta promise
            else resolve(decoded); // altrimenti risolve promise con payload
        });
    });
}