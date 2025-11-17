import { createContext, type ReactNode } from "react";

export const ProjectContext = createContext<{ id: string }>({ id: "" });

export const ProjectContextProvider = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  return (
    <ProjectContext.Provider value={{ id }}>{children}</ProjectContext.Provider>
  );
};
