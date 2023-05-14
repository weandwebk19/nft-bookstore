import { ethers } from "ethersv5";

export const getGasFee = async (provider: any, receipt: any) => {
  // Get the gas used from the transaction receipt
  const gasUsed = receipt.gasUsed;
  // Get the gas price from the transaction object
  const txObject = await provider?.getTransaction(receipt.transactionHash);
  const gasPrice = txObject?.gasPrice;
  // Calculate the total gas fee in wei
  const gasFee = gasUsed.mul(gasPrice);
  // Convert gas fee from wei to ether
  const gasFeeInEth = ethers.utils.formatEther(gasFee);
  return gasFeeInEth;
};
