'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Switch } from '@nextui-org/react'
import { IoIosMoon } from 'react-icons/io'
import { MdWbSunny } from 'react-icons/md'

export default function SwitchMode() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isSelected, setIsSelected] = useState(true)

  useEffect(() => {
    if (theme === 'light') setIsSelected(true)
    if (theme === 'dark') setIsSelected(false)
    setMounted(true)
  }, [theme])

  function changeSwitch() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    setIsSelected(!isSelected)
  }

  if (!mounted) return null

  return (
    <Switch
      defaultSelected={!isSelected}
      size="lg"
      color="secondary"
      thumbIcon={isSelected ? <IoIosMoon /> : <MdWbSunny />}
      onValueChange={changeSwitch}
    />
  )
}
