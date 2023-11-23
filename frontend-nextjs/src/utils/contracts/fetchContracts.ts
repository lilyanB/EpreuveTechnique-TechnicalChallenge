import { readContracts } from '@wagmi/core'
import { onlineBankContract } from '@/utils/contracts/setupContracts'

enum AccountType {
  COURANT,
  LIVRETA,
}

export async function fetchAccountBalance(address: any, index: any) {
  const data = await readContracts({
    contracts: [
      // @ts-ignore
      {
        ...onlineBankContract,
        functionName: 'getAccountBalance',
        args: [address, index],
      },
    ],
  })
  return data
}

export async function fetchAllAccounts(address: any) {
  const data = await readContracts({
    contracts: [
      // @ts-ignore
      {
        ...onlineBankContract,
        functionName: 'getAllAccounts',
        args: [address],
      },
    ],
  })
  return data
}

export async function fetchAccounts(address: any) {
  const COURANT = await fetchAccountBalance(address, AccountType.COURANT)
  const LIVRETA = await fetchAccountBalance(address, AccountType.LIVRETA)
  return [COURANT[0].result, LIVRETA[0].result]
}
