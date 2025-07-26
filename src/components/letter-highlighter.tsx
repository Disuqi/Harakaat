import { AnimatePresence, motion } from "motion/react";

export default function LetterHighlighter({
    mistake,
    position,
    letterSize,
    animationDuration = 0.3,
}: {
    mistake: boolean;
    position: { x: number; y: number };
    letterSize: { width: number; height: number };
    animationDuration?: number;
}) {
    const size = {
        width: letterSize.width + 3,
        height: 36,
    };
    return (
        <AnimatePresence>
            <motion.div
                className={`z-0 absolute pointer-events-none ${
                    mistake ? "bg-red-500" : "bg-primary-100"
                }`}
                style={{
                    width: size.width,
                    height: size.height,
                    left: position.x - size.width / 2,
                    top: position.y - size.height / 2,
                    zIndex: 0,
                    borderRadius: "3px",
                }}
                initial={{ scale: 0.8 }}
                animate={{
                    scale: mistake ? 1.3 : 1,
                    x: mistake ? [-2, 2, -2, 2, 0] : 0,
                    y: mistake ? [-2, 2, -2, 2, 0] : 0,
                }}
                exit={{ scale: 0.8 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    mass: 0.6,
                    x: {
                        type: "tween",
                        duration: animationDuration,
                        ease: "easeInOut",
                    },
                    y: {
                        type: "tween",
                        duration: animationDuration,
                        ease: "easeInOut",
                    },
                }}
                layout
            />
        </AnimatePresence>
    );
}
