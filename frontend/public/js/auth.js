/**
 * auth.js — shared script loaded on every page.
 *
 * Responsibilities:
 *  1. Load the shared navbar and footer components.
 *  2. Call /validate to check the current session.
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
    return fetch('/api/v1/auth/validate', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            const loginItem  = document.getElementById('nav-login-item');
            const userItem   = document.getElementById('nav-user-item');
            const logoutItem = document.getElementById('nav-logout-item');
            const navUser    = document.getElementById('nav-user');

            if (data.authenticated) {
                navUser.textContent       = '✓ ' + data.user.displayName;
                navUser.title             = data.user.email;
                loginItem.style.display   = 'none';
                userItem.style.display    = '';
                logoutItem.style.display  = '';
            } else {
                loginItem.style.display   = '';
                userItem.style.display    = 'none';
                logoutItem.style.display  = 'none';
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
