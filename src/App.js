import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeforeLogin from './pages/before_login';
import AfterLogin from './pages/after_login';
import MyKitchen from './pages/my_kitchen';
import MySink from './pages/kitchen/my_sink';
import MyGameRoom from './pages/mygameroom';
import IMacCanvas from './pages/myroom_effects/imac';
import MyBed from './pages/myroom_effects/bed';
import Bookshelf from './pages/myroom_effects/bookshelf';
import MoonLight from './pages/myroom_effects/ moonlight';
import BananaLight from './pages/myroom_effects/ moonlight';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/ori" element={<BeforeLogin />} />
      {/* <Route path="/" element={<BeforeLogin />} /> */}
      {/* <Route path="/" element={<AfterLogin />} /> */}
      <Route path="room" element={<MyGameRoom />} />
      {/* <Route path="/" element={<MyKitchen />} /> */}

      <Route path="/" element={<BananaLight />} />
    </Routes>
  </BrowserRouter>
);

export default App;
