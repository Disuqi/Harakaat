"use client";
import { useState, createContext, useContext } from "react";

export interface IGlobalContext
{
    inEnglish: boolean;
    setInEnglish: (inEnglish: boolean) => void;

    lastLetterOnly: boolean;
    setLastLetterOnly: (mode: boolean) => void;

    hideControls: boolean;
    setHideControls: (hide: boolean) => void;
}

const GlobalContext = createContext<IGlobalContext | null>(null);

export function GlobalContextProvider({children}: {children: React.ReactNode}) {
    const [inEnglish, setInEnglish] = useState(false);
    const [lastLetterOnly, setLastLetterOnly] = useState(false);
    const [hideControls, setHideControls] = useState(false);

    return (
        <GlobalContext.Provider
            value={{
                inEnglish,
                setInEnglish,
                lastLetterOnly,
                setLastLetterOnly,
                hideControls,
                setHideControls
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() : IGlobalContext
{
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalContextProvider");
    }
    return context;
}