import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { jsonRpcProvider } from "../constants/provider";

const useRunners = () => {
	const [signer, setSigner] = useState(null);
	const { walletProvider } = useAppKitProvider("eip155");
	// console.log({signer})

	const provider = useMemo(
		() => (walletProvider ? new BrowserProvider(walletProvider) : null),
		[walletProvider]
	);

	useEffect(() => {
		if (!provider) return setSigner(null);

		const handleSetSigner = async () => {
			try {
				const newSigner = await provider.getSigner();
				if (!newSigner) return;
				if (!signer) setSigner(newSigner);

				if (newSigner.address === signer?.address) return;
				setSigner(newSigner);
			} catch (error) {
				console.log({ error });
			}
		};

		handleSetSigner();

		// provider.getSigner().then((newSigner) => {
		//     if (!signer) return setSigner(newSigner);
		//     if (newSigner.address === signer.address) return;
		//     setSigner(newSigner);
		// });
	}, [provider, signer]);

	return { provider, signer, readOnlyProvider: jsonRpcProvider };
};

export default useRunners;
