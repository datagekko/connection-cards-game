
import React from 'react';

const Confetti: React.FC = () => {
    const confettiPieces = Array.from({ length: 100 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animation: `fall ${Math.random() * 2 + 3}s linear ${Math.random() * 2}s infinite`,
            background: `hsl(${Math.random() * 360}, 70%, 50%)`,
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: Math.random(),
            width: `${Math.floor(Math.random() * 10) + 5}px`,
            height: `${Math.floor(Math.random() * 10) + 5}px`,
        };
        return <div key={i} className="confetti-piece" style={style}></div>;
    });

    return (
        <>
            <style>{`
                .confetti-piece {
                    position: absolute;
                    top: -20px;
                    z-index: 1000;
                }
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                    }
                }
            `}</style>
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
                {confettiPieces}
            </div>
        </>
    );
};

export default Confetti;
