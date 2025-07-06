import {
    Languages,
    Cog,
} from "lucide-react";
import { translations } from "@/lib/text";
import React from "react";

export default function Header({ setHideControls }: { setHideControls: (hide: boolean) => void }) {
    const text = translations.en;
    return (
        <div className="navbar text-text-100">
            <div className="navbar-start ml-2">
                <DropDown label={<Cog />}>
                    <Toggle>{text.settings.allLetters}</Toggle>
                    <Toggle onChange={(e) => setHideControls(e.target.checked)}>{text.settings.hideControls}</Toggle>
                </DropDown>
            </div>

            <div className="navbar-center cursor-pointer">
                <h1 className="hover:text-primary-100 font-title font-bold text-5xl transition ease-in-out">حركات</h1>
            </div>

            <div className="navbar-end mr-2">
                <div className="flex justify-center items-center gap-2">
                    <IconToggle
                        onIcon={<Languages />}
                        offIcon={<Languages className="rotate-y-180" />}
                    />
                </div>
            </div>
        </div>
    );
}

interface IconToggleProps {
    onIcon: React.ReactNode;
    offIcon: React.ReactNode;
    labelClassName?: string;
    inputClassName?: string;
}

function IconToggle({
    onIcon,
    offIcon,
    labelClassName = "",
    inputClassName = "",
}: IconToggleProps) {
    return (
        <div className="p-2 flex items-center justify-center borderrounded-full">
            <label
                className={`swap w-6 h-6 ${labelClassName} hover:text-primary-100 active:text-primary-200 transition-all ease-in-out`}
            >
                <input type="checkbox" className={inputClassName} />
                <span className="swap-on">{onIcon}</span>
                <span className="swap-off">{offIcon}</span>
            </label>
        </div>
    );
}

function DropDown({label, children}: {label: React.ReactNode; children: React.ReactNode}) {
    return (
        <div className="dropdown dropdown-start">
            <div
                tabIndex={0}
                role="button"
                className="transition ease-in-out hover:text-primary-100 active:text-primary-200 cursor-pointer"
            >
                {label}
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content menu bg-bg-200 dark:bg-dark-bg-200 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              {React.Children.map(children, (child, index) => (
                <li key={index}>{child}</li>
              ))}
            </ul>
        </div>
    );
}

function Toggle({children, onChange}: {children: React.ReactNode; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void}) {
  return   <label className="label">
    <input type="checkbox" onChange={onChange} className="toggle border-bg-300 dark:border-dark-bg-300 bg-bg-200 dark:bg-dark-bg-200 checked:bg-bg-200 dark:checked:bg-dark-bg-200 checked:border-primary-100 checked:text-primary-100" />
    {children}
  </label>
}
