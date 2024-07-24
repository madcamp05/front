import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTextColor = () => {
    switch (location.pathname) {
      case '/room':
      case '/kitchen':
      case '/game':
      case '/room/bookshelf':
      case '/room/imac':
      case '/game/minigame':
      case '/kitchen/fridge':
        return 'black';
      case '/room/bed':
      case '/game/light':
      case '/game/fan':
      case '/kitchen/sink':
      case '/kitchen/table':
        return 'white';
      default:
        return 'black';
    }
  };

  const textColor = getTextColor();

  return (
    <div className="sidebar">
      <button style={{ color: textColor }} onClick={() => navigate('/room')}>Bed Room</button>
      <button style={{ color: textColor }} onClick={() => navigate('/kitchen')}>Kitchen</button>
      <button style={{ color: textColor }} onClick={() => navigate('/game')}>Game Room</button>
    </div>
  );
};

export default Sidebar;
