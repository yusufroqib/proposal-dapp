import { Box } from "@radix-ui/themes";
import Layout from "./components/Layout";
import CreateProposalModal from "./components/CreateProposalModal";
import Proposals from "./components/Proposals";
import { useProposals } from "./context/proposalsContext";
import NewstateProvider from "./context/newStateContext";

function App() {
	const { proposals } = useProposals();
	return (
		<Layout>
			<NewstateProvider>
				<Box className="flex justify-end p-4">
					<CreateProposalModal />
				</Box>
			</NewstateProvider>

			<Proposals proposals={proposals} />
		</Layout>
	);
}

export default App;
