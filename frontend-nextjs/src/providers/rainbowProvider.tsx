'use client'

import * as React from 'react'
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
  Theme,
  lightTheme,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { sepolia } from 'viem/chains'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()]
)

const projectId = '4553aed4455ed3718b9271d2c9519377'
console.log(projectId)

const { wallets } = getDefaultWallets({
  appName: 'project',
  projectId,
  chains,
})

const demoAppInfo = {
  appName: 'project',
}

const connectors = connectorsForWallets([...wallets])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export function RainbowProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  const { theme } = useTheme()
  const [rainbowTheme, setRainbowTheme] = useState<Theme>()

  useEffect(() => {
    console.log(theme)
    if (theme == 'dark') setRainbowTheme(darkTheme())
    if (theme == 'light') setRainbowTheme(lightTheme())
  }, [theme])

  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={rainbowTheme}
        chains={chains}
        appInfo={demoAppInfo}
      >
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
