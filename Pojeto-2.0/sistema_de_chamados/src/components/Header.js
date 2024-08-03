import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';

const Header = () => {
  return (
    <>
      <style>
        {`
          .sidebar {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            height: 60px;
            background: linear-gradient(135deg, #ff5722, #ff9800); 
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 10px 0;
            box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            box-sizing: border-box; 
          }

          .sidebar a {
            color: #fff; 
            text-decoration: none;
            display: flex;
            align-items: center;
            font-size: 16px;
            padding: 0 10px;
            transition: background 0.3s, color 0.3s;
            flex: 1; 
            justify-content: center;
          }

          .sidebar a svg {
            margin-right: 4px;
          }

          .sidebar a:hover {
            background: linear-gradient(135deg, #ff5722, #ff9800);
            color: #fff; 
            border-radius: 5px;
          }

          @media (max-width: 600px) {
            .sidebar {
              height: 50px; 
            }

            .sidebar a {
              font-size: 14px; 
              padding: 0 8px; 
            }

            .sidebar a svg {
              margin-right: 2px; 
            }
          }
        `}
      </style>
      <div className="sidebar">
        <Link to="/">
          <FiHome color="#fff" size={24} />
          Chamados
        </Link>
        <Link to="/customers">
          <FiUser color="#fff" size={24} />
          Clientes
        </Link>
        <Link to="/profile">
          <FiSettings color="#fff" size={24} />
          Perfil
        </Link>
      </div>
    </>
  );
};

export default Header;
