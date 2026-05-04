import { createContext } from "react";
import type { RepositoryContainer } from "@/repositories";

export const RepositoryContext = createContext<RepositoryContainer | null>(
  null,
);
