'use client'

import { fetchAccounts } from '@/utils/contracts/fetchContracts'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  const [accounts, setAccounts] = useState<any[]>([])

  useEffect(() => {
    if (isConnected) {
      const fetchData = async () => {
        try {
          const accountsBalances = await fetchAccounts(address)
          console.log(accountsBalances)
          setAccounts(accountsBalances)
        } catch (error) {
          console.error('Error fetching items:', error)
        }
      }

      fetchData()
    }
  }, [isConnected])

  return (
    <main className="flex flex-col items-center h-screen space-y-6">
      <div className="flex flex-col h-11/12 w-11/12 border-solid border-2">
        <h1>Accounts</h1>
        {/* Display Accounts*/}
        {accounts.map((account, index) => (
          <div key={index}>
            {index === 0 ? 'Courant' : 'LIVRET A'} : {account.toString()} EUR
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-6 h-11/12 w-11/12 border-solid border-2">
        <h1>Operations</h1>
      </div>
      <div className="flex flex-col gap-6 h-11/12 w-11/12 border-solid border-2">
        <h1>Graph</h1>
      </div>
    </main>
  )
}
