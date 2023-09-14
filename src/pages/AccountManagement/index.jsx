import { useState } from 'react';
import {
  User,
  IdentificationCard,
} from '@phosphor-icons/react';

import Header from '@/components/SharedComponents/Header';

import { Section } from '@/components/AccountManagement/Sections';

import * as A from './styles.module.css';

const AccountManagement = () => {
  const [currentAnchorClicked, setCurrentAnchorClicked] = useState('profile');


  const handleAnchorClick = (anchorType) => {
    setCurrentAnchorClicked(anchorType);
  }

  return (
    <div className={A.container} id='profile'>
      <Header />
      <main className={A.content}>

        <nav className={A.sidebar}>

          <h3>Configurações da conta</h3>

          <ul className={A.menu}>

            <li
              className={`${A.menuItem} ${currentAnchorClicked === 'profile' ? A.isActive : ''}`}
              onClick={() => handleAnchorClick('profile')}
            >
              <a href="#profile">
                <User /> Perfil
              </a>
            </li>

            <li
              className={`${A.menuItem} ${currentAnchorClicked === 'credentials' ? A.isActive : ''}`}
              onClick={() => handleAnchorClick('credentials')}
            >
              <a href="#credentials" >
                <IdentificationCard /> Credenciais
              </a>
            </li>

          </ul>

        </nav>

        <Section.Root>

          <Section.Profile />
          <Section.Credentials />

        </Section.Root>


      </main>
    </div>
  );
};

export default AccountManagement;
