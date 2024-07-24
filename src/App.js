import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeforeLogin from './pages/before_login';
import AfterLogin from './pages/after_login';
import MyKitchen from './pages/my_kitchen';
import MySink from './pages/kitchen/my_sink';
<<<<<<< HEAD
import MyGameRoom from './pages/mygameroom';
import IMacCanvas from './pages/myroom_effects/imac';
import MyBed from './pages/myroom_effects/bed';
import Bookshelf from './pages/myroom_effects/bookshelf';
import MoonLight from './pages/myroom_effects/ moonlight';
import BananaLight from './pages/myroom_effects/ moonlight';
=======
import MyTable from './pages/kitchen/my_table';
import MyFridge from './pages/kitchen/my_fridge';
import MyOven from './pages/kitchen/my_oven';
>>>>>>> 242d3326fbbeda44d01b005d25556e2b37052aa6

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/ori" element={<BeforeLogin />} />
<<<<<<< HEAD
      {/* <Route path="/" element={<BeforeLogin />} /> */}
      {/* <Route path="/" element={<AfterLogin />} /> */}
      <Route path="room" element={<MyGameRoom />} />
      {/* <Route path="/" element={<MyKitchen />} /> */}

      <Route path="/" element={<BananaLight />} />
=======
      <Route path="/room" element={<AfterLogin />} />
      <Route path="/kitchen" element={<MyKitchen />} />
      <Route path="/kitchen/sink" element={<MySink />} />
      <Route path="/" element={<MyTable />} />
      <Route path="/kitchen/fridge" element={<MyFridge />} />
      <Route path="/kitchen/oven" element={<MyOven />} />
>>>>>>> 242d3326fbbeda44d01b005d25556e2b37052aa6
    </Routes>
  </BrowserRouter>
);

export default App;
