import { useContext } from "react";
import { DevicesContext } from "../contexts/DevicesContext"

export function useDevices() {
  const context = useContext(DevicesContext);

  return context;
}
