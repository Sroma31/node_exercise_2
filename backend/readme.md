lo schema di funzionamento geneceale è essenzialmente questo:

CLIENT + GATEWAY + SERVER + API ESTERNA

il compito del gateway e:

couting delle richieste
rate limiting
caching (riduce carico sul server)
sicurezza (es: blocco ip, TLS termination)
garantisce scalabilità
logging
load balancing (se un giorno hai più server)
separazione tra frontend e backend
biding endpoint

la struttura davanti al server serve per tenere ben separati i ruoli dei server di servizio da quello del gateway


