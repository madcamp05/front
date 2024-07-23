import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeforeLogin from './pages/before_login';
import AfterLogin from './pages/after_login';
import MyKitchen from './pages/my_kitchen';
import MySink from './pages/kitchen/my_sink';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/ori" element={<BeforeLogin />} />
      <Route path="/room" element={<AfterLogin />} />
      <Route path="/gameroom" element={<MyGameRoom />} />
      <Route path="/" element={<MyKitchen />} />

      <Route path="/kitchen/sink" element={<MySink />} />
    </Routes>
  </BrowserRouter>
);

export default App;
