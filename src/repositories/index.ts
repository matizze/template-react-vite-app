import { NamespaceBuilder } from "@/lib/factory";
import { MockTaskRepository } from "./task";
import { MockAuthRepository } from "./auth";

export const repositories = {
  create: () => {
    return new NamespaceBuilder()
      .register("tasks", new MockTaskRepository())
      .register("auth", new MockAuthRepository())
      .build();
  },
};

export type RepositoryContainer = ReturnType<typeof repositories.create>;
