import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeforeLogin from './pages/before_login';
import AfterLogin from './pages/after_login';
import MyKitchen from './pages/my_kitchen';
import MySink from './pages/kitchen/my_sink';
import MyGameRoom from './pages/mygameroom';
import IMacCanvas from './pages/myroom/imac';
import MyBed from './pages/myroom/bed';
import Bookshelf from './pages/myroom/bookshelf';
import MoonLight from './pages/myroom/ moonlight';
import BananaLight from './pages/myroom/ moonlight';
import MyTable from './pages/kitchen/my_table';
import MyFridge from './pages/kitchen/my_fridge';
import MyOven from './pages/kitchen/my_oven';
import BookshelfScene from './pages/myroom/bookshelf';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/ori" element={<BeforeLogin />} />
      <Route path="/room" element={<AfterLogin />} /> 
      <Route path="/" element={<BookshelfScene />} /> 

      <Route path="/game" element={<MyGameRoom />} />
      <Route path="/game/light" element={<BananaLight />} />

      <Route path="/kitchen" element={<MyKitchen />} />
      <Route path="/kitchen/sink" element={<MySink />} />
      <Route path="/kitchen/table" element={<MyTable />} />
      <Route path="/kitchen/fridge" element={<MyFridge />} />
      <Route path="/kitchen/oven" element={<MyOven />} />
    </Routes>
  </BrowserRouter>
);

export default App;
