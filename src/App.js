import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeforeLogin from './pages/before_login';
import AfterLogin from './pages/after_login';
import MyKitchen from './pages/my_kitchen'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<BeforeLogin />} />
      <Route path="/room" element={<AfterLogin />} />
      <Route path="/kitchen" element={<MyKitchen />} />
    </Routes>
  </BrowserRouter>
);

export default App;
