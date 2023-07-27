import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HardDrives, XCircle, GameController } from '@phosphor-icons/react';

import { useContextAuth } from '@/hooks/useAuth';
import logoMicrodigo from '@/assets/images/logo-microdigo.svg';
import { Dropdown } from '@/components/Dropdown';
import { AvatarIcon } from '@/components/AvatarIcon';
import MenuBurguerIcon from '@/components/MenuBurguerIcon';

import * as H from './styles.module.css';

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

      <div className={H.menuPagesContainer}>

        <MenuBurguerIcon onClick={handleActivePagesMenu} />

        {pagesMenuIsActive &&

          (
            <Dropdown.Root>
              <Dropdown.Item>
                <Dropdown.ItemLink src={'/platform'}>
                  <GameController />
                  <span>Plataforma</span>
                </Dropdown.ItemLink>
              </Dropdown.Item>

            </Dropdown.Root>
          )
        }
      </div>

      <div
        className={H.menuConfigContainer}
      >

        <AvatarIcon.Root
          handleClick={handleActiveAccountsMenu}
        >
          <AvatarIcon.ContentText text={userNameTransform} />
        </AvatarIcon.Root>

        {
          accountsMenuIsActive &&
          (
            <Dropdown.Root orientation='right'>
              <Dropdown.Item>
                <Dropdown.ItemLink src={'/account'}>
                  <HardDrives />
                  <span>Meus dados</span>
                </Dropdown.ItemLink>
              </Dropdown.Item>

              <Dropdown.Item>
                <Dropdown.ItemButton
                  handleClick={handleSignOut}
                >
                  <XCircle />
                  <span>Sair</span>
                </Dropdown.ItemButton>
              </Dropdown.Item>

            </Dropdown.Root>
          )
        }
      </div>
    </header>
  );
};

export default Header;
