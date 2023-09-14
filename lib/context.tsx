import { createContext, useState } from "react";

export const AppContext = createContext(null);
const AppProvider = ({ children }) => {
    const [asteroidsInBacket, setAsteroidsInBacket] = useState([]);
    const [asteroidInfo, setAsteroidInfo] = useState<string>(null);

    return (
        <AppContext.Provider
            value={{
                asteroidsInBacket,
                setAsteroidsInBacket,
                asteroidInfo,
                setAsteroidInfo,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
