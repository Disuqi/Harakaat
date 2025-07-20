export default function Button({
    children,
    className = "",
    onClick = () => {},
    disabled = false,
}:{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            className={`px-4 py-2 rounded-md text-center flex gap-2 items-center justify-center text-primary-100 border-bg-300 bg-bg-200 border hover:shadow-[4px_4px_0px_0px] hover:shadow-bg-300 dark:hover:shadow-dark-bg-300 active:shadow-none dark:border-dark-bg-300 dark:bg-dark-bg-100 active:border-primary-300 active:text-primary-300 active:bg-primary-100 font-medium text-sm transition-all duration-200 ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
