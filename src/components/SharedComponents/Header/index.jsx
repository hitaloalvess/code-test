import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HardDrives, XCircle, File } from '@phosphor-icons/react';

import { useContextAuth } from '@/hooks/useAuth';
import logoMicrodigo from '@/assets/images/logo-microdigo.svg';
import { Dropdown } from '@/components/SharedComponents/Dropdown';
import { AvatarIcon } from '@/components/SharedComponents/AvatarIcon';
import MenuBurguerIcon from '@/components/SharedComponents/MenuBurguerIcon';

import * as H from './styles.module.css';

const Header = () => {

  const { handleSignOut, person } = useContextAuth();
  const [enabledMenu, setEnabledMenu] = useState('');

  const handleShortenName = (name) => {
    const partitionedName = name.split(' ');

    if (partitionedName <= 0) return;

    if (partitionedName.length > 1) {
      const firstLetterName = `${(partitionedName[0])}`
      const firstLetterSurname = `${(partitionedName[partitionedName.length - 1])}`

      const shortName = `${firstLetterName.charAt(0)}${firstLetterSurname.charAt(0)}`
      return shortName.toLocaleUpperCase();
    }

    const firstLetterName = `${(partitionedName[0])}`;

    return `${firstLetterName.charAt(0)}`.toLocaleUpperCase();

  }
  const userNameTransform = useMemo(() => {
    const name = person.name;

    const shortedName = handleShortenName(name);

    return shortedName;
  }, [person.name]);


  const handleEnableMenu = (typeMenu) => {
    setEnabledMenu(prev => {
      if (prev === typeMenu) return '';

      return typeMenu;
    })
  }

  return (
    <header className={H.container}>

      <Link to={'/plataforma'}>
        <img
          src={logoMicrodigo}
          alt="Logo da microdigo"
          loading='lazy'
        />
      </Link>

      <div className={H.menuPagesContainer}>

        <MenuBurguerIcon
          onClick={() => handleEnableMenu('pages')}
          isActive={enabledMenu === 'pages'}
        />

        {enabledMenu === 'pages' &&

          (
            <Dropdown.Root>
              <Dropdown.Item>
                <Dropdown.ItemLink src={'/projetos'}>
                  <File />
                  <span>Meus projetos</span>
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
          handleClick={() => handleEnableMenu('accounts')}
        >
          <AvatarIcon.ContentText text={userNameTransform} />
        </AvatarIcon.Root>

        {
          enabledMenu === 'accounts' &&
          (
            <Dropdown.Root orientation='right'>
              <Dropdown.Item>
                <Dropdown.ItemLink src={'/conta'}>
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
