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
import IMacCanvas from './pages/myroom_effects/imac';
import MyBed from './pages/myroom_effects/bed';
import Bookshelf from './pages/myroom_effects/bookshelf';
import MoonLight from './pages/myroom_effects/ moonlight';
import BananaLight from './pages/myroom_effects/ moonlight';
import MiniGame from './pages/gameroom/minigame';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<BeforeLogin />} />
      {/* <Route path="/" element={<BeforeLogin />} /> */}
      {/* <Route path="/" element={<AfterLogin />} /> */}
      <Route path="/gameroom" element={<MyGameRoom />} />
      <Route path="/kitchen" element={<MyKitchen />} />
      <Route path="/myroom" element={<AfterLogin />} />

      <Route path="/gameroom/minigame" element={<MiniGame />} />
      <Route path="/myroom/imac" element={<IMacCanvas />} />
      <Route path="/myroom/bed" element={<MyBed />} />

    </Routes>
  </BrowserRouter>
);

export default App;
