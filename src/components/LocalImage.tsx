import React from 'react';


const LocalImage = ({ children }: React.PropsWithChildren) => {
    return (
        <div className="relative w-full min-h-screen bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: "url('/photo1.png')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
            <div className="relative z-20 text-white text-center p-10 sm:p-5">
                {children}
            </div>
        </div>
    );
};

export default LocalImage;
