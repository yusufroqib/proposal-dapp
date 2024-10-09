import { useCallback } from "react";
import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitNetwork, useAppKitAccount } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { parseEther } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";

const useCreateProposal = () => {
	const contract = useContract(true);
	const { address } = useAppKitAccount();
	const { chainId } = useAppKitNetwork();
	// console.log({caipNetwork})

	// console.log({ address, status, isConnected });

	const createProposal = useCallback(
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

				// 120

				const txResponce = await contract.createProposal(
					description,
					recipient,
					parseEther(amount),
					duration,
					minVote,
					{
						gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
					}
				);

				console.log({ txResponce });

				const reciept = await txResponce.wait();

				console.log({ reciept });

				if (reciept.status === 1) {
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

	const voteForProposal = useCallback(
		async (id) => {
			if (!id) {
				toast.error("Id required!");
				return;
			}
			try {
				const tx = await contract.vote(id);
				const reciept = await tx.wait();
				if (reciept.status === 1) {
					toast.success("Voting successful");
					return;
				}
				toast.error("Voting failed");
			} catch (error) {
				// console.error("error while voting: ", error);
				// toast.error(error.reason);

				const errorDecoder = ErrorDecoder.create();

				const decodedError = await errorDecoder.decode(error);

				console.log("decodedError: ", decodedError);
			}
		},
		[contract]
	);

	const executeProposal = useCallback(
		async (proposalId) => {
			if (!proposalId) {
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
				const estimatedGas = await contract.executeProposal.estimateGas(
					proposalId
				);
				const tx = await contract.executeProposal(proposalId, {
					gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
				});
				const reciept = await tx.wait();

				if (reciept.status === 1) {
					toast.success("Executed successfully");
					return;
				}
				toast.error("Voting failed");
				return;
			} catch (error) {
				console.error("error while voting: ", error.reason);
				toast.error(error?.reason);
			}
		},
		[address, chainId, contract]
	);

	return { createProposal, voteForProposal, executeProposal };
};

export default useCreateProposal;
