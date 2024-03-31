import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import React, {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import LottoArtifact from '../artifacts/contracts/Lotto.sol/Lotto649.json';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledPotSizeText = styled.p`
    font-weight: bold;
    `;

export function Lotto(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [lottoContract, setLottoContract] = useState<Contract>();
  const [lottoContractAddr, setLottoContractAddr] = useState<string>('');
  const [potSize, setPotSize] = useState<string>('');

  useEffect((): void => {
    if (!library) return;
    const signer = library.getSigner();
    setSigner(signer);
  }, [library]);

  useEffect((): void => {
    if (!signer) return;
    const lottoContract = new Contract(
      lottoContractAddr,
      LottoArtifact.abi,
      signer
    );
    setLottoContract(lottoContract);
  }, [signer, lottoContractAddr]);

  const handleDeployContract = async (): Promise<void> => {
    if (!signer) return;
    const factory = new ethers.ContractFactory(
      LottoArtifact.abi,
      LottoArtifact.bytecode,
      signer
    );
    const contract = await factory.deploy();
    await contract.deployed();
    setLottoContractAddr(contract.address);
  };

  const handleGetPotSize = async (): Promise<void> => {
    if (!lottoContract) return;
    const potSize = await lottoContract.getPotSize();
    setPotSize(potSize.toString());
  };

  return (
    <>
      <StyledDeployContractButton onClick={handleDeployContract}>
        Deploy Lotto Contract
      </StyledDeployContractButton>
      <SectionDivider />
      <StyledDeployContractButton onClick={handleGetPotSize}>
        Get Pot Size
      </StyledDeployContractButton>
      <StyledPotSizeText>
        Current Pot Size: {potSize}
      </StyledPotSizeText>
    </>
  );
}