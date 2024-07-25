import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BeforeLogin from './pages/before_login';
import AfterLogin from './pages/after_login';
import MyKitchen from './pages/my_kitchen';
import MySink from './pages/kitchen/my_sink';
import MyGameRoom from './pages/mygameroom';
import IMacCanvas from './pages/myroom/imac';
import MyBed from './pages/myroom/bed';
import Bookshelf from './pages/myroom/bookshelf';
import MoonLight from './pages/myroom/moonlight';
import BananaLight from './pages/myroom/moonlight';
import MyTable from './pages/kitchen/my_table';
import MyFridge from './pages/kitchen/my_fridge';
import MyOven from './pages/kitchen/my_oven';
import BookshelfScene from './pages/myroom/bookshelf';
import FanScene from './pages/gameroom/fan';
import Clock from './pages/clock';
import Bed from './pages/myroom/bed';
import Sidebar from './Sidebar';

const Layout = () => {
  //const location = useLocation();
  //const showSidebar = ['/room', '/game', '/kitchen'].some(path => location.pathname.startsWith(path));

  return (
    <div className="app-container">
      <Sidebar />
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
        <Route path="/kitchen/sink" element={<MySink />} />
        <Route path="/kitchen/table" element={<MyTable />} />
        <Route path="/kitchen/fridge" element={<MyFridge />} />
        <Route path="/kitchen/oven" element={<MyOven />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);

export default App;
