import { createContext, createRef, RefObject, useContext } from "react";

export const GraphContext = createContext<{ parent: string | null }>({ parent: null });
export const ContainerContext = createContext<RefObject<HTMLDivElement>>(createRef());
export const useContainerContext = () => useContext(ContainerContext);
