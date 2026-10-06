// Main React Application Controller & State Orchestrator
(function() {
  const App = function App() {
    // Current authenticated user state
    const [user, setUser] = React.useState(() => window.AuthService.getCurrentUser());
    
    // Active Screen Route: 'home' | 'write' | 'history' | 'profile' | 'auth'
    const [currentRoute, setRoute] = React.useState(() => (user ? 'home' : 'auth'));

    // Entry currently being edited (null for new entry)
    const [editingEntry, setEditingEntry] = React.useState(null);

    // List of diary entries for current user
    const [entries, setEntries] = React.useState([]);

    // Writing statistics (streak, dominant mood, total entries)
    const [stats, setStats] = React.useState({ totalEntries: 0, streak: 0, dominantMood: null });

    // Active Toast Notifications
    const [toasts, setToasts] = React.useState([]);

    // Initialize user theme on load
    React.useEffect(() => {
      if (user && user.theme) {
        document.documentElement.setAttribute('data-theme', user.theme);
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }, [user]);

    // Load user entries and refresh stats whenever user or route updates
    const refreshEntries = React.useCallback(() => {
      if (!user) {
        setEntries([]);
        setStats({ totalEntries: 0, streak: 0, dominantMood: null });
        return;
      }
      const userEntries = window.StorageService.getEntries(user.id);
      setEntries(userEntries);
      const userStats = window.StorageService.getStats(user.id);
      setStats(userStats);
    }, [user]);

    React.useEffect(() => {
      refreshEntries();
    }, [refreshEntries, currentRoute]);

    // Toast Notification Dispatcher
    const showToast = (message, type = 'info') => {
      const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
      setToasts(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    const dismissToast = (id) => {
      setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Navigation Handlers
    const handleAuthSuccess = (authenticatedUser) => {
      setUser(authenticatedUser);
      setRoute('home');
      refreshEntries();
    };

    const handleLogout = () => {
      window.AuthService.logout();
      setUser(null);
      setEditingEntry(null);
      setRoute('auth');
      showToast('Signed out safely.', 'info');
    };

    const handleDeleteAccount = () => {
      window.AuthService.deleteAccount();
      setUser(null);
      setEditingEntry(null);
      setRoute('auth');
    };

    const handleStartNewEntry = () => {
      setEditingEntry(null);
      setRoute('write');
    };

    const handleEditEntry = (entry) => {
      setEditingEntry(entry);
      setRoute('write');
    };

    const handleSaveEntrySuccess = () => {
      setEditingEntry(null);
      refreshEntries();
      setRoute('history');
    };

    const handleDiscardEntry = () => {
      setEditingEntry(null);
      setRoute('home');
    };

    const handleDeleteEntry = (entryId) => {
      if (user) {
        window.StorageService.deleteEntry(user.id, entryId);
        refreshEntries();
      }
    };

    const handleLoadDemo = () => {
      if (user) {
        window.StorageService.loadDemoEntries(user.id);
        refreshEntries();
        showToast('Sample demo entries loaded.', 'success');
      }
    };

    const handleClearDemo = () => {
      if (user) {
        window.StorageService.clearDemoEntries(user.id);
        refreshEntries();
        showToast('Sample demo entries removed.', 'info');
      }
    };

    const handleClearAllEntries = () => {
      if (user) {
        window.StorageService.clearAllEntries(user.id);
        refreshEntries();
      }
    };

    const handleOpenEntryById = (entryId) => {
      const entry = window.StorageService.getEntryById(user.id, entryId);
      if (entry) {
        handleEditEntry(entry);
      }
    };

    // Unauthenticated View
    if (!user || currentRoute === 'auth') {
      return (
        <div>
          <window.AuthScreen
            onAuthSuccess={handleAuthSuccess}
            showToast={showToast}
          />
          <window.ToastNotification toasts={toasts} onDismiss={dismissToast} />
        </div>
      );
    }

    // Authenticated View Router
    return (
      <div className="app-container">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <window.Navbar
            currentRoute={currentRoute}
            setRoute={(route) => {
              setEditingEntry(null);
              setRoute(route);
            }}
            user={user}
            onNewEntry={handleStartNewEntry}
          />

          <main className="main-content">
            {currentRoute === 'home' && (
              <window.HomeScreen
                user={user}
                entries={entries}
                stats={stats}
                onNavigateWrite={handleStartNewEntry}
                onNavigateHistory={() => setRoute('history')}
                onOpenEntry={handleOpenEntryById}
                onLoadDemo={handleLoadDemo}
              />
            )}

            {currentRoute === 'write' && (
              <window.WriteScreen
                user={user}
                editingEntry={editingEntry}
                onSaveSuccess={handleSaveEntrySuccess}
                onDiscard={handleDiscardEntry}
                showToast={showToast}
              />
            )}

            {currentRoute === 'history' && (
              <window.HistoryScreen
                user={user}
                entries={entries}
                onEditEntry={handleEditEntry}
                onDeleteEntry={handleDeleteEntry}
                showToast={showToast}
              />
            )}

            {currentRoute === 'profile' && (
              <window.ProfileScreen
                user={user}
                onUpdateUser={setUser}
                onLogout={handleLogout}
                onDeleteAccount={handleDeleteAccount}
                onLoadDemo={handleLoadDemo}
                onClearDemo={handleClearDemo}
                onClearAllEntries={handleClearAllEntries}
                showToast={showToast}
              />
            )}
          </main>
        </div>

        <window.ToastNotification toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  };

  // Mount application to DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
  }
})();
