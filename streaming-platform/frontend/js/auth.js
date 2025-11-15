/**
 * StreamVibe Authentication Utilities
 * Handles user authentication state and helpers
 */

/**
 * Get current authenticated user
 */
function getCurrentUser() {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }
  return null;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return !!token;
}

/**
 * Get authentication token
 */
function getAuthToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

/**
 * Set authentication data
 */
function setAuthData(user, token, remember = true) {
  if (remember) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    sessionStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

/**
 * Clear authentication data (logout)
 */
function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
}

/**
 * Logout user
 */
function logout() {
  clearAuthData();
  window.location.href = 'login.html';
}

/**
 * Require authentication (redirect to login if not authenticated)
 */
function requireAuth() {
  if (!isAuthenticated()) {
    const currentUrl = window.location.href;
    window.location.href = `login.html?redirect=${encodeURIComponent(currentUrl)}`;
    return false;
  }
  return true;
}

/**
 * Redirect if authenticated (for login/signup pages)
 */
function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || 'index.html';
    window.location.href = redirect;
    return true;
  }
  return false;
}

/**
 * Update user data in storage
 */
function updateUser(userData) {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
}

/**
 * Check if user owns resource
 */
function isOwner(resourceUserId) {
  const user = getCurrentUser();
  return user && user.id === resourceUserId;
}

/**
 * Format user display name
 */
function formatDisplayName(user) {
  return user.displayName || user.username || 'Unknown User';
}

/**
 * Get user avatar URL
 */
function getUserAvatar(user, size = 'md') {
  if (user.avatar) {
    return user.avatar;
  }

  // Generate placeholder avatar
  const sizes = {
    sm: 24,
    md: 40,
    lg: 80,
    xl: 120
  };

  const dimension = sizes[size] || 40;
  const initial = (user.displayName || user.username || 'U').charAt(0).toUpperCase();

  return `https://ui-avatars.com/api/?name=${initial}&size=${dimension}&background=FF0050&color=fff&bold=true`;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format
 */
function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate password strength
 */
function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculate password strength (0-5)
 */
function getPasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/)) strength++;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;

  return strength;
}

/**
 * Check if user is verified (can upload videos)
 * Users become verified with 1000+ subscribers OR 10000+ views
 */
function isVerified(user = null) {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;

  const subscribers = currentUser.subscribers || 0;
  const totalViews = currentUser.totalViews || 0;

  return subscribers >= 1000 || totalViews >= 10000;
}

/**
 * Get verification progress
 */
function getVerificationProgress(user = null) {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return { verified: false, progress: 0 };

  const subscribers = currentUser.subscribers || 0;
  const totalViews = currentUser.totalViews || 0;

  const subsProgress = (subscribers / 1000) * 100;
  const viewsProgress = (totalViews / 10000) * 100;

  return {
    verified: isVerified(currentUser),
    subscribers,
    totalViews,
    subsProgress: Math.min(subsProgress, 100),
    viewsProgress: Math.min(viewsProgress, 100),
    overallProgress: Math.max(subsProgress, viewsProgress),
    subsNeeded: Math.max(0, 1000 - subscribers),
    viewsNeeded: Math.max(0, 10000 - totalViews)
  };
}

/**
 * Initialize demo user with stats
 * This simulates having a user with some stats for demonstration
 */
function initializeDemoUser() {
  const user = getCurrentUser();
  if (user && !user.subscribers) {
    // Add demo stats if they don't exist
    const demoStats = {
      subscribers: Math.floor(Math.random() * 2000), // Random 0-2000
      totalViews: Math.floor(Math.random() * 20000), // Random 0-20000
      totalVideos: Math.floor(Math.random() * 10)
    };

    updateUser(demoStats);
  }
}

/**
 * Handle authentication errors
 */
function handleAuthError(error) {
  if (error.code === 'UNAUTHORIZED') {
    clearAuthData();
    window.location.href = 'login.html';
  }
}

/**
 * Initialize user menu (common across pages)
 */
function initializeUserMenu(elementId = 'userMenu') {
  const userMenuElement = document.getElementById(elementId);
  if (!userMenuElement) return;

  const user = getCurrentUser();

  if (user) {
    userMenuElement.innerHTML = `
      <button class="icon-btn" onclick="window.location.href='upload.html'" data-tooltip="Upload Video">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
      <button class="icon-btn" onclick="window.location.href='notifications.html'" data-tooltip="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </button>
      <div class="dropdown">
        <img
          src="${getUserAvatar(user, 'sm')}"
          alt="${formatDisplayName(user)}"
          class="user-avatar"
          onclick="toggleUserDropdown()"
        >
        <div class="dropdown-menu hidden" id="userDropdown">
          <div class="dropdown-item" onclick="window.location.href='dashboard.html'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Dashboard
          </div>
          <div class="dropdown-item" onclick="window.location.href='profile.html?user=${user.username}'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Your Channel
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" onclick="logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </div>
        </div>
      </div>
    `;
  } else {
    userMenuElement.innerHTML = `
      <a href="login.html" class="btn btn-ghost btn-sm">Sign In</a>
      <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
    `;
  }
}

/**
 * Toggle user dropdown menu
 */
function toggleUserDropdown() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown && !dropdown.classList.contains('hidden')) {
    const isClickInside = event.target.closest('.dropdown');
    if (!isClickInside) {
      dropdown.classList.add('hidden');
    }
  }
});

// Initialize demo user on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
      initializeDemoUser();
    }
  });
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCurrentUser,
    isAuthenticated,
    getAuthToken,
    setAuthData,
    clearAuthData,
    logout,
    requireAuth,
    redirectIfAuthenticated,
    updateUser,
    isOwner,
    formatDisplayName,
    getUserAvatar,
    isValidEmail,
    isValidUsername,
    validatePassword,
    getPasswordStrength,
    isVerified,
    getVerificationProgress,
    initializeDemoUser,
    handleAuthError,
    initializeUserMenu,
    toggleUserDropdown
  };
}
