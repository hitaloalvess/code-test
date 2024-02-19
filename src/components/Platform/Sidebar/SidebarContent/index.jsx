import P from 'prop-types';
import { useSidebar } from '@/hooks/useSidebar';

import { menu } from './styles.module.css';

const SidebarContent = ({ children }) => {
  const { attachRef } = useSidebar();

  return (
    <nav
      className={menu}
      ref={attachRef}
    >
      {children}
    </nav>
  )
}

SidebarContent.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default SidebarContent;
