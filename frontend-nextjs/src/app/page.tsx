'use client'

import { AccountType, fetchAccounts } from '@/utils/contracts/fetchContracts'
import { useEffect, useState } from 'react'
import { useAccount, useContractWrite } from 'wagmi'
import { Button, Input } from '@nextui-org/react'
import { onlineBankContract } from '@/utils/contracts/setupContracts'

export default function Home() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  const [accounts, setAccounts] = useState<any[]>([])
  const [courantValue, setCourantValue] = useState<string>()
  const [livretAValue, setLivretAValue] = useState<string>()

  useEffect(() => {
    if (isConnected) {
      fetchAccountBalance()
    }
  }, [isConnected])

  const { data, isLoading, isSuccess, write } = useContractWrite(
    // @ts-ignore
    {
      functionName: 'deposit',
      ...onlineBankContract,
    }
  )
  const { write: writeWithdraw } = useContractWrite(
    // @ts-ignore
    {
      functionName: 'withdraw',
      ...onlineBankContract,
    }
  )

  const fetchAccountBalance = async () => {
    try {
      const accountsBalances = await fetchAccounts(address)
      setAccounts(accountsBalances)
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }

  const handleDepositClick = async (accountType: string) => {
    const value = accountType === 'COURANT' ? courantValue : livretAValue
    console.log(`Depositing ${value} EUR to ${accountType}`)
    if (accountType === 'COURANT') {
      console.log('deposit courant')
      await write({
        args: [AccountType.COURANT, value],
      })
    }
    if (accountType !== 'COURANT') {
      console.log('deposit livretA')
      await write({
        args: [AccountType.LIVRETA, value],
      })
    }
    try {
    } catch (error) {
      console.error('Error performing buy action:', error)
    }
  }

  const handleWithdrawClick = async (accountType: string) => {
    const value = accountType === 'COURANT' ? courantValue : livretAValue
    console.log(`Depositing ${value} EUR to ${accountType}`)
    if (accountType === 'COURANT') {
      console.log('deposit courant')
      await writeWithdraw({
        args: [AccountType.COURANT, value],
      })
    }
    if (accountType !== 'COURANT') {
      console.log('deposit livretA')
      await writeWithdraw({
        args: [AccountType.LIVRETA, value],
      })
    }
    try {
    } catch (error) {
      console.error('Error performing buy action:', error)
    }
  }

  return (
    <main className="flex flex-col items-center h-screen space-y-6">
      <div className="flex flex-col h-11/12 w-11/12 border-solid border-2">
        <h1>Accounts</h1>
        {accounts.length > 1 && (
          <>
            <div>Courant {accounts[0].toString()} EUR</div>
            <Input
              type="number"
              placeholder="Enter EUR"
              value={courantValue}
              onValueChange={setCourantValue}
            />
            <Button
              color="primary"
              onClick={() => handleDepositClick('COURANT')}
            >
              deposit to Courant
            </Button>
            <Button
              color="primary"
              onClick={() => handleWithdrawClick('COURANT')}
            >
              withdraw from Courant
            </Button>
            <div>Liret A {accounts[1].toString()} EUR</div>
            <Input
              type="number"
              placeholder="Enter EUR"
              value={livretAValue}
              onValueChange={setLivretAValue}
            />
            <Button
              color="primary"
              onClick={() => handleDepositClick('LIVRETA')}
            >
              deposit to Livret A
            </Button>
            <Button
              color="primary"
              onClick={() => handleWithdrawClick('COURANT')}
            >
              withdraw from Courant
            </Button>
          </>
        )}
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
