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
            background: linear-gradient(135deg, #ff5722, #ff9800); /* Degradê laranja */
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 10px 0;
            box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            box-sizing: border-box; /* Inclui padding e borda no total width/height */
          }

          .sidebar a {
            color: #fff; /* Branco para o texto */
            text-decoration: none;
            display: flex;
            align-items: center;
            font-size: 16px;
            padding: 0 10px; /* Ajusta o padding para caber melhor em telas pequenas */
            transition: background 0.3s, color 0.3s;
            flex: 1; /* Faz os links ocuparem igualmente o espaço disponível */
            justify-content: center; /* Centraliza o ícone e o texto */
          }

          .sidebar a svg {
            margin-right: 4px; /* Ajusta o espaço entre o ícone e o texto */
          }

          .sidebar a:hover {
            background: #fff; /* Branco para o fundo ao passar o mouse */
            color: #ff5722; /* Laranja para o texto ao passar o mouse */
            border-radius: 5px;
          }

          @media (max-width: 600px) {
            .sidebar {
              height: 50px; /* Reduz a altura para telas menores */
            }

            .sidebar a {
              font-size: 14px; /* Reduz o tamanho da fonte para telas menores */
              padding: 0 8px; /* Ajusta o padding para caber melhor em telas menores */
            }

            .sidebar a svg {
              margin-right: 2px; /* Reduz o espaço entre o ícone e o texto em telas menores */
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
