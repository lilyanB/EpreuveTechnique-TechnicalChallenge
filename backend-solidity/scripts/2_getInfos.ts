import { ethers } from "hardhat";

async function main() {
  function Enum(...options: string[]) {
    return Object.fromEntries(options.map((key, i) => [key, BigInt(i)]));
  }

  const deployer = "0x607Ec1a7F093801b40DaE21131dDAdB8ce991106"
  const onlineBankAddress = "0x5FeFF2aeAA4B26eB4eCD221aA337352E13281A23"
  const myERC20Address = "0x2dE37409D4D8ED1908f9fE64C3038e2280D41268"

  const AccountType = Enum("COURANT", "LIVRETA");

  // const OnlineBank = await ethers.getContractFactory("OnlineBank");
  // const onlineBank = OnlineBank.attach(onlineBankAddress);
  const onlineBank = await ethers.getContractAt("OnlineBank", onlineBankAddress)
  console.log(`deployed onlineBank at ${onlineBank.target}`);

  // const MyERC20 = await ethers.getContractFactory("MyERC20");
  // const currency = MyERC20.attach(myERC20Address);
  const currency = await ethers.getContractAt("MyERC20", myERC20Address)
  console.log(`deployed euroNumerique at ${currency.target}`);

  const balance = await onlineBank.getAccountBalance(deployer, AccountType.COURANT);
  console.log(balance)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
