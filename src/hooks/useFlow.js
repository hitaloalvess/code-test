import { useContext } from "react"
import { FlowContext } from "../contexts/FlowContext"

export const useFlow = () => {
  const context = useContext(FlowContext);

  return context;
}
