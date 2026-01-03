import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Letters from './pages/Letters';
import VirtualHome from './pages/VirtualHome';
import Goals from './pages/Goals';
import Agenda from './pages/Agenda';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/letters" element={<Letters />} />
          <Route path="/home" element={<VirtualHome />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/agenda" element={<Agenda />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
