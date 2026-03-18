import React from 'react';
import AppProviders from './providers/AppProviders';
import AppRouter    from './routes/AppRouter';

const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);

export default App;
