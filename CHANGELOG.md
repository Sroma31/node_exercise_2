# Changelog

## [1.3.0] - 07/11/27

### Changed
 
#### Navbar dinamica con sessione passport:
saparato il Benvenuto dal cambio tasto login/logout

#### Frontend
Index fa richiesta su endpoint /me sul modello della navbar per far comparire gif a centropagina in caso di true su authorized.
modellato il frontend per gestire la costruzione in dom anche di tasto e label

#### authRoutes
prompt: "select_account", per mascherare che la session lato google rimanga aperta

#### persistenceServe
costruito il server persistence sul modello auth

#### Documentation
iniziata la sinificazione di redme.txt
