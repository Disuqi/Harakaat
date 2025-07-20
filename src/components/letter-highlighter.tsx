import { AnimatePresence, motion } from "motion/react";

export default function LetterHighlighter({
    mistake,
    position,
    size,
}: {
    mistake: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
}) {
    return (
        <AnimatePresence>
            <motion.div
                className={`absolute pointer-events-none ${
                    mistake ? "bg-red-500" : "bg-primary-100"
                }`}
                style={{
                    width: size.width,
                    height: size.height,
                    left: position.x - size.width / 2,
                    top: position.y - size.height / 2,
                    zIndex: 0,
                    borderRadius: "4px",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: mistake ? 1.3 : 1,
                    x: mistake ? [-2, 2, -2, 2, 0] : 0,
                    y: mistake ? [-2, 2, -2, 2, 0] : 0,
                    opacity: 1,
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    mass: 0.6,
                    x: {
                        type: "tween",
                        duration: 0.3,
                        ease: "easeInOut",
                    },
                    y: {
                        type: "tween",
                        duration: 0.3,
                        ease: "easeInOut",
                    },
                }}
                layout
            />
        </AnimatePresence>
    );
}
