/**
 * auth.js — backward compatibility wrapper pointing to /api/v1/auth/me.
 *
 * Responsibilities:
 *  1. Load the shared navbar and footer components.
 *  2. Call /api/v1/auth/me to check the current session and retrieve user details.
 *  3. Update the navbar to show the user's name + Logout (authenticated)
 *     or the Login link (unauthenticated).
 */

/** Load an HTML component into a container element by id. */
function loadComponent(containerId, url) {
    return fetch(url)
        .then(res => res.text())
        .then(html => {
            const el = document.getElementById(containerId);
            if (el) el.innerHTML = html;
        });
}

/** Apply auth state to the navbar after it has been injected. */
function applyAuthState() {
    return fetch('/api/v1/auth/me', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            const loginItem  = document.getElementById('nav-login-item');
            const signupItem = document.getElementById('nav-signup-item');
            const userItem   = document.getElementById('nav-user-item');
            const logoutItem = document.getElementById('nav-logout-item');
            const navUser    = document.getElementById('nav-user');

            if (data && data.authenticated) {
                const user = data.user || {};
                const name = data.firstName || user.firstName || user.displayName || data.displayName || 'Utente';
                const email = data.email || user.email || '';

                if (navUser) {
                    navUser.textContent = '✓ ' + name;
                    navUser.title       = email ? `${name} (${email})` : name;
                }
                if (loginItem)  loginItem.style.display  = 'none';
                if (signupItem) signupItem.style.display = 'none';
                if (userItem)   userItem.style.display   = '';
                if (logoutItem) logoutItem.style.display = '';
            } else {
                if (loginItem)  loginItem.style.display  = '';
                if (signupItem) signupItem.style.display = '';
                if (userItem)   userItem.style.display   = 'none';
                if (logoutItem) logoutItem.style.display = 'none';
            }
        })
        .catch(() => {}); // silently ignore if auth-service is unreachable
}

// Load navbar first, then apply auth state; load footer in parallel.
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar', '/api/v1/components/navbar.html')
        .then(applyAuthState);

    loadComponent('footer', '/api/v1/components/footer.html');
});
