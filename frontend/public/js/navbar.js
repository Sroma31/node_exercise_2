/**
 * navbar.js — Gestore unificato per la barra di navigazione e l'autenticazione.
 *
 * Funzionalità:
 *  1. Carica asincronamente i componenti condivisi (navbar e footer).
 *  2. Interroga l'endpoint protetto /api/v1/auth/me (router.get /me di auth-service).
 *  3. Aggiorna lo stato visivo della navbar in base alla sessione:
 *     - Autenticato: mostra il nome dell'utente (firstName / displayName) e il pulsante Logout;
 *     - Non autenticato: mostra i link di Login e Signup.
 */

/**
 * Carica un componente HTML all'interno del contenitore indicato via ID.
 * @param {string} containerId ID dell'elemento DOM contenitore
 * @param {string} url Percorso del componente HTML da recuperare
 * @returns {Promise<void>}
 */
function loadComponent(containerId, url) {
    const el = document.getElementById(containerId);
    if (!el) return Promise.resolve();

    return fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`Impossibile caricare il componente: ${url}`);
            return res.text();
        })
        .then(html => {
            el.innerHTML = html;
        })
        .catch(err => {
            console.warn(`Errore nel caricamento del componente ${containerId}:`, err);
        });
}

/**
 * Interroga l'endpoint /api/v1/auth/me e aggiorna gli elementi della navbar.
 * @returns {Promise<void>}
 */
function applyAuthState() {
    return fetch('/api/v1/auth/me', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            const loginItem  = document.getElementById('nav-login-item');
            const signupItem = document.getElementById('nav-signup-item');
            const userItem   = document.getElementById('nav-user-item');
            const logoutItem = document.getElementById('nav-logout-item');
            const navUser    = document.getElementById('nav-user');
            const persistanceBtn    = document.getElementById('btn-persistance');
            const persistanceResult = document.getElementById('persistance-result');

            if (data && data.authenticated) {
                const user = data.user || {};
                const displayName = data.firstName || user.firstName || user.displayName || data.displayName || 'Utente';
                const email = data.email || user.email || '';

                if (navUser) {
                    navUser.textContent = '✓ ' + displayName;
                    navUser.title = email ? `${displayName} (${email})` : displayName;
                }
                if (loginItem)  loginItem.style.display  = 'none';
                if (signupItem) signupItem.style.display = 'none';
                if (userItem)   userItem.style.display   = '';
                if (logoutItem) logoutItem.style.display = '';
                if (persistanceBtn) persistanceBtn.style.display = 'inline-block';
            } else {
                if (loginItem)  loginItem.style.display  = '';
                if (signupItem) signupItem.style.display = '';
                if (userItem)   userItem.style.display   = 'none';
                if (logoutItem) logoutItem.style.display = 'none';
                if (persistanceBtn) persistanceBtn.style.display = 'none';
                if (persistanceResult) persistanceResult.style.display = 'none';
            }
        })
        .catch(() => {
            // Se auth-service non risponde o la sessione non è valida, mostra i pulsanti di default
            const loginItem  = document.getElementById('nav-login-item');
            const signupItem = document.getElementById('nav-signup-item');
            const userItem   = document.getElementById('nav-user-item');
            const logoutItem = document.getElementById('nav-logout-item');
            const persistanceBtn    = document.getElementById('btn-persistance');
            const persistanceResult = document.getElementById('persistance-result');

            if (loginItem)  loginItem.style.display  = '';
            if (signupItem) signupItem.style.display = '';
            if (userItem)   userItem.style.display   = 'none';
            if (logoutItem) logoutItem.style.display = 'none';
            if (persistanceBtn) persistanceBtn.style.display = 'none';
            if (persistanceResult) persistanceResult.style.display = 'none';
        });
}

// Inizializzazione automatica al caricamento del DOM
document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar');
    const footerContainer = document.getElementById('footer');

    const navbarPromise = (navbarContainer && !navbarContainer.children.length)
        ? loadComponent('navbar', '/api/v1/components/navbar.html')
        : Promise.resolve();

    navbarPromise.then(applyAuthState);

    if (footerContainer && !footerContainer.children.length) {
        loadComponent('footer', '/api/v1/components/footer.html');
    }
});

// Esposizione globale per consentire chiamate programmatiche
window.loadComponent = loadComponent;
window.applyAuthState = applyAuthState;
