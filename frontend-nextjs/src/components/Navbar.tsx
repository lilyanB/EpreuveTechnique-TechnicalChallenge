'use client'

import React, { useEffect, useState } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'
import SwitchMode from './SwitchMode'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Logo from './Logo'
import Link from 'next/link'

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const menuItems = ['Dashboard']
  const menuLinks = ['/']

  const renderNavbarItems = () => {
    return menuItems.map((item, index) => (
      <NavbarMenuItem key={`${item}-${index}`}>
        <Link className="w-full" color="foreground" href={menuLinks[index]}>
          {item}
        </Link>
      </NavbarMenuItem>
    ))
  }

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent>
        <NavbarBrand>
          <Link href="/">
            <Logo />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem
            key={`${item}-${index}`}
            isActive={menuLinks[index] === window.location.pathname}
          >
            <Link color="foreground" href={menuLinks[index]}>
              {item}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex"></NavbarItem>
        <NavbarItem>
          <div className="flex">
            <SwitchMode />
            <ConnectButton accountStatus="avatar" chainStatus="icon" />
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>{renderNavbarItems()}</NavbarMenu>
    </Navbar>
  )
}
