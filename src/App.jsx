import { Box } from "@radix-ui/themes";
import Layout from "./components/Layout";
import CreateProposalModal from "./components/CreateProposalModal";
import Proposals from "./components/Proposals";
import { useEffect } from "react";

import useProposals from "./hooks/useProposals";
import useContract from "./hooks/useContract";

function App() {
	const { proposals, fetchProposals } = useProposals();

	const readOnlyProposalContract = useContract();


	useEffect(() => {

        fetchProposals();

		readOnlyProposalContract.on("ProposalCreated", fetchProposals);
		readOnlyProposalContract.on("Voted", fetchProposals);
		readOnlyProposalContract.on("ProposalExecuted", fetchProposals);
		return () => {
			readOnlyProposalContract.removeListener(
				"ProposalCreated",
				fetchProposals
			);
			readOnlyProposalContract.removeListener("Voted", fetchProposals);
			readOnlyProposalContract.removeListener("ProposalExecuted", fetchProposals);
		};
	}, [readOnlyProposalContract, fetchProposals]);


 
	return (
		<Layout>
			<Box className="flex justify-end p-4">
				<CreateProposalModal />
			</Box>
			<Proposals proposals={proposals} />
		</Layout>
	);
}

export default App;
