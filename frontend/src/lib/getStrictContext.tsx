import * as React from 'react'

export function getStrictContext<T>(name?: string) {
  const Context = React.createContext<T | undefined>(undefined)

  function Provider({
    value,
    children,
  }: Readonly<{
    value: T
    children?: React.ReactNode
  }>) {
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useSafeContext() {
    const context = React.useContext(Context)

    if (context === undefined) {
      throw new Error(
        `useContext must be used within ${name ?? 'a Provider'}`,
      )
    }

    return context
  }

  return [Provider, useSafeContext] as const
}
