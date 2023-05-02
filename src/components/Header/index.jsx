import logoMicrodigo from '../../assets/images/logo-microdigo.svg';

import { header } from './styles.module.css';

const Header = () => {
    return (
        <header className={header}>
            <img
                src={logoMicrodigo}
                alt="Logo da microdigo"
                loading='lazy'
            />
        </header>
    );
};

export default Header;