import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Contacts from './Contacts';
import Leads from './Leads';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/leads" element={<Leads />} />
    </Routes>
  );
}

export default AppRoutes;
