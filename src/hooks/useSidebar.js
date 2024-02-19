import { useContext } from "react";
import { SidebarContext } from '@/contexts/SidebarContext';

export const useSidebar = () => {
  const context = useContext(SidebarContext);

  return context;
}
