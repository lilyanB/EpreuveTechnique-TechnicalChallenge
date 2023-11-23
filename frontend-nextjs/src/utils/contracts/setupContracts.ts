import onlineBankJSON from './ABI/OnlineBank.json'
import myERC20JSON from './ABI/MyERC20.json'
import { onlineBankAddress, myERC20Address } from './constants'

const onlineBankABI = onlineBankJSON.abi
const myERC20ABI = myERC20JSON.abi

export const onlineBankContract = {
  address: onlineBankAddress,
  abi: onlineBankABI,
}
export const myERC20Contract = {
  address: myERC20Address,
  abi: myERC20ABI,
}
