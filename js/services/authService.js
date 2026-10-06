// Authentication Service Layer
(function() {
  const SESSION_KEY = 'uedvr_auth_session';
  const USERS_KEY = 'uedvr_registered_users';

  // Seed default registered users if none exists
  function getRegisteredUsers() {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const defaultUsers = {
        'demo@diary.app': {
          id: 'usr_demo_123',
          email: 'demo@diary.app',
          password: 'password123',
          name: 'Elena Rostova',
          bio: 'Journaling daily for peace of mind, self-discovery, and growth.',
          preferredTime: '21:00',
          theme: 'light',
          createdAt: new Date().toISOString()
        }
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(raw);
  }

  function saveRegisteredUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  window.AuthService = {
    getCurrentUser() {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },

    login(email, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const cleanEmail = email.trim().toLowerCase();
          const users = getRegisteredUsers();

          if (!users[cleanEmail]) {
            return reject(new Error('No account found with this email address. Please sign up.'));
          }

          if (users[cleanEmail].password !== password) {
            return reject(new Error('Incorrect password. Please try again or click "Forgot password?".'));
          }

          const user = { ...users[cleanEmail] };
          delete user.password; // Do not keep password in session
          localStorage.setItem(SESSION_KEY, JSON.stringify(user));
          resolve(user);
        }, 300); // Realistic slight async network delay
      });
    },

    signUp(email, password, name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const cleanEmail = email.trim().toLowerCase();
          const users = getRegisteredUsers();

          if (users[cleanEmail]) {
            return reject(new Error('An account with this email already exists. Please sign in instead.'));
          }

          if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
            return reject(new Error('Please enter a valid email address.'));
          }

          if (password.length < 6) {
            return reject(new Error('Password must be at least 6 characters long.'));
          }

          const newUser = {
            id: 'usr_' + Date.now(),
            email: cleanEmail,
            password: password,
            name: name ? name.trim() : cleanEmail.split('@')[0],
            bio: 'Writing my story one day at a time.',
            preferredTime: '20:30',
            theme: 'light',
            createdAt: new Date().toISOString()
          };

          users[cleanEmail] = newUser;
          saveRegisteredUsers(users);

          const sessionUser = { ...newUser };
          delete sessionUser.password;
          localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
          resolve(sessionUser);
        }, 350);
      });
    },

    forgotPassword(email) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const cleanEmail = email.trim().toLowerCase();
          const users = getRegisteredUsers();

          if (!users[cleanEmail]) {
            return reject(new Error('No account found with this email.'));
          }

          resolve(`Password reset instructions have been sent to ${cleanEmail}. (Demo mode: Use your existing password or reset password)`);
        }, 400);
      });
    },

    updateProfile(updatedFields) {
      const user = this.getCurrentUser();
      if (!user) return null;

      const users = getRegisteredUsers();
      const cleanEmail = user.email.toLowerCase();

      if (users[cleanEmail]) {
        users[cleanEmail] = { ...users[cleanEmail], ...updatedFields };
        saveRegisteredUsers(users);
      }

      const updatedUser = { ...user, ...updatedFields };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    },

    logout() {
      localStorage.removeItem(SESSION_KEY);
    },

    deleteAccount() {
      const user = this.getCurrentUser();
      if (user) {
        const users = getRegisteredUsers();
        delete users[user.email.toLowerCase()];
        saveRegisteredUsers(users);
        // Clear user's local entries & draft
        localStorage.removeItem(`uedvr_entries_${user.id}`);
        localStorage.removeItem(`uedvr_draft_${user.id}`);
        this.logout();
      }
    }
  };
})();
