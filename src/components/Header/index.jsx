import { Link } from 'react-router-dom';
import logoMicrodigo from '../../assets/images/logo-microdigo.svg';

import { header } from './styles.module.css';

const Header = () => {
  return (
    <header className={header}>
      <Link to={'/account'}>
        <img
          src={logoMicrodigo}
          alt="Logo da microdigo"
          loading='lazy'
        />
      </Link>
    </header>
  );
};

export default Header;
