import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function Logo() {
  const { theme, setTheme } = useTheme()
  const [url, setUrl] = useState('')

  useEffect(() => {
    console.log(theme)
    if (theme == 'dark') setUrl('/logo-white.png')
    if (theme == 'light') setUrl('/logo-black.png')
  }, [theme])

  return <Image src={url} width={50} height={50} alt="logo" />
}
