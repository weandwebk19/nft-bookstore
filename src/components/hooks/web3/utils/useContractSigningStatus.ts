import { useEffect, useState } from "react";

import { ethers } from "ethers";

type ContractAbi = {
  contractAddress: string;
  contractAbi: ethers.ContractInterface;
};

type UseContractSigningStatusProps = {
  provider: ethers.providers.Web3Provider;
  contractAbi: ContractAbi;
  userAddress: string;
};

type ContractSigningStatus = "WAITING" | "SUCCESS" | "ERROR";

const useContractSigningStatus = ({
  provider,
  contractAbi,
  userAddress
}: UseContractSigningStatusProps): ContractSigningStatus => {
  const [status, setStatus] = useState<ContractSigningStatus>("WAITING");

  useEffect(() => {
    const checkContractSigningStatus = async () => {
      try {
        const contract = new ethers.Contract(
          contractAbi.contractAddress,
          contractAbi.contractAbi,
          provider.getSigner()
        );
        const isSigned = await contract.isSigned(userAddress);
        setStatus(isSigned ? "SUCCESS" : "WAITING");
      } catch (error) {
        setStatus("ERROR");
      }
    };

    checkContractSigningStatus();
  }, [provider, contractAbi, userAddress]);

  return status;
};

export default useContractSigningStatus;
