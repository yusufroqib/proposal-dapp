import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { parseEther } from "ethers";

const useCreateProposal = () => {
	const contract = useContract(true);
	const { address } = useAppKitAccount();
	const { chainId } = useAppKitNetwork();
    const [openModal, setOpenModal] = useState(false);
	const handleCreateProposal = useCallback(
		async (description, recipient, amount, duration, minVote) => {
			if (!description || !recipient || !amount || !duration || !minVote) {
				toast.error("Missing field(s)");
				return;
			}
			if (!address) {
				toast.error("Connect your wallet!");
				return;
			}
			if (Number(chainId) !== liskSepoliaNetwork.chainId) {
				toast.error("You are not connected to the right network");
				return;
			}

			if (!contract) {
				toast.error("Cannot get contract!");
				return;
			}

			try {
				const estimatedGas = await contract.createProposal.estimateGas(
					description,
					recipient,
					parseEther(amount),
					duration,
					minVote
				);
				const tx = await contract.createProposal(
					description,
					recipient,
					parseEther(amount),
					duration,
					minVote,
					{
						gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
					}
				);
				const reciept = await tx.wait();

				if (reciept.status === 1) {
                    setOpenModal(false)
					toast.success("Proposal Creation successful");
					return;
				}
				toast.error("Proposal Creation failed");
				return;
			} catch (error) {
				console.error("error while creating proposal: ", error);
				toast.error("Proposal Creation errored");
			}
		},
		[address, chainId, contract]
	);
	return { handleCreateProposal, openModal, setOpenModal };
};

export default useCreateProposal;
