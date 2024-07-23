import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeforeLogin from './pages/before_login';
import AfterLogin from './pages/after_login';
import MyGameRoom from './pages/mygameroom';

import MyKitchen from './pages/my_kitchen'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<BeforeLogin />} />
      <Route path="/room" element={<AfterLogin />} />
      <Route path="/gameroom" element={<MyGameRoom />} />
      <Route path="/kitchen" element={<MyKitchen />} />

    </Routes>
  </BrowserRouter>
);

export default App;
