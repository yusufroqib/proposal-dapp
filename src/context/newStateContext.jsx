import { createContext, useState } from "react";

export const NewStateContext = createContext({
	count: 0,
	setCount: () => {},
});

const NewstateProvider = ({ children }) => {
	const [count, setCount] = useState(0);

	return (
		<NewStateContext.Provider value={{ count, setCount }}>
			{children}
		</NewStateContext.Provider>
	);
};

export default NewstateProvider;
