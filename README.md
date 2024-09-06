•Obiettivo del Progetto
Il progetto mira a fornire uno strumento completo e intuitivo per la gestione delle prenotazioni di ombrelloni e lettini in uno stabilimento balneare. Il sistema consente di visualizzare e gestire in modo efficace le prenotazioni, ottimizzando le operazioni quotidiane e migliorando l'esperienza sia per il personale che per i clienti.

•Funzionalità Principali

 - Login Riservato
    L'accesso al sistema è riservato esclusivamente al titolare dello stabilimento e allo staff autorizzato dal titolare, come bagnini o responsabili delle prenotazioni. Questo garantirà che solo il personale competente possa gestire le prenotazioni e accedere ai dati sensibili.
    - solo l'admin può registrare utenti utilizzando la sua password che ho configurato in adminConfig.js, inoltre i componenti per registrare gli users e il riepilogo delle finanze sono accessibili solo all'admin.

 - Gestione delle Prenotazioni
   Il sistema permette di inserire le date di prenotazione e il nome della persona che ha effettuato l'affitto. Inoltre, è possibile registrare il numero di lettini richiesti per ciascuna prenotazione.

 - Calcolo dei Prezzi
   Funzionalità per calcolare automaticamente il prezzo totale della prenotazione in base alla durata del soggiorno e ai servizi richiesti. Questo include il calcolo dinamico in base alle tariffe impostate dallo stabilimento. 
   - ciò è stato inserito nella sidebar quando viene cliccato un ombrellone dove è possibile modificare sia il prezzo dell'ombrellone per le prenotazioni da effettuare che effettuare, modificare o cancellare le prenotazioni.

 - Non possono essere prenotati ombrelloni in date antecedenti al giorno odierno o effettuate prenotazioni che si sovrappongono. Questo avviene anche nelle modifiche delle prenotazioni già esistenti.

 - Riepilogo delle prenotazioni, dei servizi aggiuntivi e del saldo   parziale e totale per ogni singolo ombrellone all'interno della sidebar. Sono contrassegnate di rosso le prenotazioni da saldare ed in verde quelle saldate.

 - Visualizzazione dello Stato degli Ombrelloni
    Gli ombrelloni nel sistema cambiano graficamente in base al loro stato (prenotato o disponibile) giorno per giorno ed è inoltre possibile fare una ricerca per date che ritorna gli ombrelloni disponibili o occupati graficamente.

 - Identificazione degli Ombrelloni per Persone con Disabilità
    Gli ombrelloni accessibili sono stati configurati a fianco alla passerella, infatti sono contrassegnati come isAccessible.

 - Nel componente Booking Status è possibile visualizzare il riepilogo dell'andamento delle finanze.

 - Ho implementato un BlogPost per chiunque non non abbia l'accesso, dove verranno inseriti gli eventi, sagre e spettacoli della zona grazie alla possibilità di creare nuovi post.

 - Pagina 404 NotFound per chi si perde.

 - Il sito è da modificare graficamente in vista del video.