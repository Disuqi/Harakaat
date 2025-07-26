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
    const classNames = "flex justify-center items-center gap-2 px-4 py-2 rounded-md border border-bg-300 bg-bg-100 text-text-200 text-sm hover:bg-bg-200 active:bg-bg-300 transform transition duration-200 hover:shadow-md";
    return (
        <button
            className={`${classNames} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
