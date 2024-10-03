import useRunners from "./useRunners";
import useContract from "./useContract";
import { useCallback, useState } from "react";
import { Contract } from "ethers";
import { Interface } from "ethers";
import ABI from "../ABI/proposal.json";

const multicallAbi = [
	"function tryAggregate(bool requireSuccess, (address target, bytes callData)[] calls) returns ((bool success, bytes returnData)[] returnData)",
];
const useProposals = () => {
	const [proposals, setProposals] = useState([]);
	const readOnlyProposalContract = useContract();
	const { readOnlyProvider } = useRunners();

	const fetchProposals = useCallback(async () => {
        console.log("Fetching..........")
		if (!readOnlyProposalContract) return;
		console.log("here i am");
		const multicallContract = new Contract(
			import.meta.env.VITE_MULTICALL_ADDRESS,
			multicallAbi,
			readOnlyProvider
		);

		const itf = new Interface(ABI);

		try {
			const proposalCount = Number(
				await readOnlyProposalContract.proposalCount()
			);

			const proposalsIds = Array.from(
				{ length: proposalCount - 1 },
				(_, i) => i + 1
			);

			const calls = proposalsIds.map((id) => ({
				target: import.meta.env.VITE_CONTRACT_ADDRESS,
				callData: itf.encodeFunctionData("proposals", [id]),
			}));

			const responses = await multicallContract.tryAggregate.staticCall(
				true,
				calls
			);

			const decodedResults = responses.map((res) =>
				itf.decodeFunctionResult("proposals", res.returnData)
			);

			const data = decodedResults.map((proposalStruct, index) => ({
				id: proposalsIds[index],
				description: proposalStruct.description,
				amount: proposalStruct.amount,
				minRequiredVote: proposalStruct.minVotesToPass,
				votecount: proposalStruct.voteCount,
				deadline: proposalStruct.votingDeadline,
				executed: proposalStruct.executed,
			}));
			console.log(data);
			setProposals(data);
		} catch (error) {
			console.log("error fetching proposals: ", error);
		}
	}, [readOnlyProposalContract, readOnlyProvider]);

	return {
		proposals,
		fetchProposals,
	};
};

export default useProposals;
