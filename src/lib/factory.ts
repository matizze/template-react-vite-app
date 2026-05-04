// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class NamespaceBuilder<T extends Record<string, unknown> = {}> {
  private items: Record<string, unknown> = {}

  register<K extends string, V>(key: K, instance: V): NamespaceBuilder<T & { [P in K]: V }> {
    this.items[key] = instance
    return this as unknown as NamespaceBuilder<T & { [P in K]: V }>
  }

  build(): T {
    return this.items as T
  }
}

export class ServiceFactory<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  T extends Record<string, Record<string, unknown>> = {},
> {
  private namespaces: Record<string, Record<string, unknown>> = {}

  ns<K extends string, NS extends Record<string, unknown>>(
    name: K,
    builderFn: (b: NamespaceBuilder) => NamespaceBuilder<NS>,
  ): ServiceFactory<T & { [P in K]: NS }> {
    this.namespaces[name] = builderFn(new NamespaceBuilder()).build()
    return this as unknown as ServiceFactory<T & { [P in K]: NS }>
  }

  build(): T {
    return this.namespaces as T
  }
}
