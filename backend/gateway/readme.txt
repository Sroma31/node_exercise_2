il compito del gateway è fare da ponte tra client e service. Nei fatti è un reverse proxy ossia un server che sta davanti ai servizi interni e riceve le richieste dei client al posto loro.

non ha controller
non ha logica
non ha validazioni
non ha chiamate API
non ha percorsi statici
non ha paths complessi
non ha env complessi

una volta che è costruito se si digita:
http://localhost:4000/api --> cerca file api.js nella dei root
http://localhost:4000/api/ --> directory, diventa un prefisso di routing, ossia un elemento a cui aggangio un endpoint

ora:compaiono middleware e services, perché in futuro potrebbero essere utili Verifica sessione, goole token, forward, recupero utente