import { createContext } from "react";

export const GraphContext = createContext<{ parent: string | null }>({ parent: null });
