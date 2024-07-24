import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeforeLogin from './pages/before_login';
import AfterLogin from './pages/after_login';
import MyKitchen from './pages/my_kitchen';
import MySink from './pages/kitchen/my_sink';
import MyTable from './pages/kitchen/my_table';
import MyFridge from './pages/kitchen/my_fridge';
import MyOven from './pages/kitchen/my_oven';
import MyGameRoom from './pages/mygameroom';
import IMacCanvas from './pages/myroom/imac';
import MyBed from './pages/myroom/bed';
import Bookshelf from './pages/myroom/bookshelf';
import MoonLight from './pages/myroom/ moonlight';
import BananaLight from './pages/myroom/ moonlight';
import MiniGame from './pages/gameroom/minigame';
import BookshelfScene from './pages/myroom/bookshelf';
import FanScene from './pages/gameroom/fan';
import Clock from './pages/clock';
import Bed from './pages/myroom/bed';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<BeforeLogin />} />

      <Route path="/clock" element={<Clock />} />

      <Route path="/room" element={<AfterLogin />} />
      <Route path="/room/bookshelf" element={<BookshelfScene />} />
      <Route path="/room/bed" element={<Bed />} />

      <Route path="/game" element={<MyGameRoom />} />
      <Route path="/game/light" element={<BananaLight />} />
      <Route path="/game/fan" element={<FanScene />} />

      <Route path="/kitchen" element={<MyKitchen />} />
      <Route path="/myroom" element={<AfterLogin />} />

      <Route path="/gameroom/minigame" element={<MiniGame />} />
      <Route path="/myroom/imac" element={<IMacCanvas />} />
      <Route path="/myroom/bed" element={<MyBed />} />

    </Routes>
  </BrowserRouter>
);

export default App;
