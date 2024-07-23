import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeforeLogin from './pages/before_login';
import AfterLogin from './pages/after_login';
import MyKitchen from './pages/my_kitchen';
import MySink from './pages/kitchen/my_sink';
import MyTable from './pages/kitchen/my_tabel';
import MyFridge from './pages/kitchen/my_fridge';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/ori" element={<BeforeLogin />} />
      <Route path="/room" element={<AfterLogin />} />
      <Route path="/kitchen" element={<MyKitchen />} />
      <Route path="/kitchen/sink" element={<MySink />} />
      <Route path="/kitchen/table" element={<MyTable />} />
      <Route path="/" element={<MyFridge />} />
    </Routes>
  </BrowserRouter>
);

export default App;
