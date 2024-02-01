import { SidebarProvider } from '@/contexts/SideBarContext';

import SidebarArea from './SidebarArea';
import MenuButtons from './MenuButtons';
import SidebarContent from './SidebarContent';

const Sidebar = () => {

  return (
    <SidebarProvider>

      <SidebarContent>

        <MenuButtons />

        <SidebarArea />

      </SidebarContent>

    </SidebarProvider>

  );
};


export default Sidebar;
