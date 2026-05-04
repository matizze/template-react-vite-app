import { useMemo, type ReactNode } from "react";
import { RepositoryContext } from "./context";
import { repositories as repo } from "@/repositories";

type RepositoryProviderProps = {
    children: ReactNode;
};

export function RepositoryProvider({ children }: RepositoryProviderProps) {
    const repositories = useMemo(() => repo.create(), []);

    return (
        <RepositoryContext.Provider value={repositories}>
            {children}
        </RepositoryContext.Provider>
    );
}
