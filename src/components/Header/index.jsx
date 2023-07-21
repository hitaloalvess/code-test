import { Link } from 'react-router-dom';
import { HardDrives, XCircle, House } from '@phosphor-icons/react';

import { useContextAuth } from '@/hooks/useAuth';
import logoMicrodigo from '../../assets/images/logo-microdigo.svg';

import * as H from './styles.module.css';
import { useMemo, useState } from 'react';

const Header = () => {

  const { handleSignOut, user } = useContextAuth();
  const [accountsMenuIsActive, setAccountMenuIsActive] = useState(false);
  const [pagesMenuIsActive, setPagesMenuIsActive] = useState(false);

  const userNameTransform = useMemo(() => {
    const name = user.name;

    const partitionedName = name.split(' ');
    const firstLetterName = `${(partitionedName[0])}`
    const firstLetterSurname = `${(partitionedName[partitionedName.length - 1])}`

    const shortName = `${firstLetterName.charAt(0)}${firstLetterSurname.charAt(0)}`
    return shortName.toLocaleUpperCase();

  }, [user.name]);

  const handleActiveAccountsMenu = () => {
    setAccountMenuIsActive(prev => !prev);
  }

  const handleActivePagesMenu = () => {
    setPagesMenuIsActive(prev => !prev);
  }

  return (
    <header className={H.container}>

      <Link to={'/platform'}>
        <img
          src={logoMicrodigo}
          alt="Logo da microdigo"
          loading='lazy'
        />
      </Link>

      <button
        className={H.menuBurguer}
        onClick={handleActivePagesMenu}
      >
        <div className={`${H.burguerIcon}  ${pagesMenuIsActive ? H.isActive : ''}`}></div>

        {pagesMenuIsActive &&
          (<div className={H.dropDown}>
            <ul>
              <li className={H.dropDownItem}>
                <Link to={'/platform'}>
                  <p
                    className={H.dropDownLink}
                  >
                    <House />
                    <span>Home</span>
                  </p>
                </Link>
              </li>
            </ul>
          </div>)
        }
      </button>

      <div
        className={H.menuConfigContainer}
      >
        <div
          className={H.avatar}
          onClick={handleActiveAccountsMenu}
        >
          <p className={H.avatarText} >{userNameTransform}</p>
        </div>


        {
          accountsMenuIsActive && (
            <div className={`${H.dropDown} ${H.dropDownRight}`}>
              <ul>
                <li className={H.dropDownItem}>
                  <Link to={'/account'}>
                    <p
                      className={H.dropDownLink}
                    >
                      <HardDrives />
                      <span>Meus dados</span>
                    </p>
                  </Link>
                </li>
                <li className={H.dropDownItem}>
                  <button
                    className={H.dropDownButton}
                    onClick={handleSignOut}
                  >
                    <XCircle />
                    <span>Sair</span>
                  </button>
                </li>
              </ul>
            </div>
          )
        }
      </div>
    </header>
  );
};

export default Header;
