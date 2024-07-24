import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <button onClick={() => navigate('/room')}>Bed Room</button>
      <button onClick={() => navigate('/kitchen')}>Kitchen</button>
      <button onClick={() => navigate('/game')}>Game Room</button>
    </div>
  );
};

export default Sidebar;
