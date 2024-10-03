import { Box } from "@radix-ui/themes";
import Layout from "./components/Layout";
import CreateProposalModal from "./components/CreateProposalModal";
import Proposals from "./components/Proposals";
import {  useEffect } from "react";

import useProposals from "./hooks/useProposals";

function App() {
	const { proposals, fetchProposals } = useProposals();
	
	// console.log("first");

	useEffect(() => {
		fetchProposals();
	}, [fetchProposals]);

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
