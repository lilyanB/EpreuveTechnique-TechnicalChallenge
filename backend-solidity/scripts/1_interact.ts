import { ethers } from "hardhat";

async function main() {
  function Enum(...options: string[]) {
    return Object.fromEntries(options.map((key, i) => [key, BigInt(i)]));
  }

  const deployer = "0x607Ec1a7F093801b40DaE21131dDAdB8ce991106"
  const onlineBankAddress = "0xcAf72A56A63C4Db116a0Dc66a96CcEEfB8BB1c44"
  const myERC20Address = "0x598978d58f09538378297F383907628dff05E98a"

  const AccountType = Enum("COURANT", "LIVRETA");

  // const OnlineBank = await ethers.getContractFactory("OnlineBank");
  // const onlineBank = OnlineBank.attach(onlineBankAddress);
  const onlineBank = await ethers.getContractAt("OnlineBank", onlineBankAddress)
  console.log(`deployed onlineBank at ${onlineBank.target}`);

  // const MyERC20 = await ethers.getContractFactory("MyERC20");
  // const currency = MyERC20.attach(myERC20Address);
  const currency = await ethers.getContractAt("MyERC20", myERC20Address)
  console.log(`deployed euroNumerique at ${currency.target}`);


  const mybalance = await currency.balanceOf(deployer)
  console.log(mybalance)
  const approve0 = await currency.approve(onlineBank.target, 10000)
  await approve0.wait();
  console.log("approve")
  // const deposit0 = await onlineBank.deposit(AccountType.COURANT, 10);
  // await deposit0.wait();
  // console.log("deposit")
  // const balance = await onlineBank.getAccountBalance(deployer, AccountType.COURANT);
  // console.log(balance)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
