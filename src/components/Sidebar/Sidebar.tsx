import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlineUser } from 'react-icons/ai';
import { SidebarData } from './SidebarData.tsx';
import Submenu from './Submenu.tsx';

const Sidebar: React.FC = () => {
    const [sidebar, setSidebar] = useState(false);
    const [accountMenu, setAccountMenu] = useState(false);
    const location = useLocation();

    const noSidebarPaths = ['/', '/register', '/login'];
    const showSidebar = !noSidebarPaths.includes(location.pathname);

    const toggleSidebar = () => {
        setSidebar(!sidebar);
    };

    const toggleAccountMenu = () => {
        setAccountMenu(!accountMenu);
    };

    // Function to close the sidebar
    const closeSidebar = () => {
        setSidebar(false);
    };

    if (!showSidebar) return null;

    return (
        <>
            <div
                className="fixed top-0 left-0 w-full bg-black text-white h-16 flex items-center justify-between px-4 shadow-md z-50">
                <div className="flex items-center">
                    <button onClick={toggleSidebar} className="text-2xl">
                        {sidebar ? <AiOutlineClose/> : <AiOutlineMenu/>}
                    </button>
                    <h1 className="ml-4 text-xl font-semibold">ControlFood</h1>
                </div>

                <div className="relative ml-2">
                    <button onClick={toggleAccountMenu} className="flex items-center">
                        <AiOutlineUser className="text-4xl"/>
                    </button>
                    {accountMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                            <Link to="/my-account" className="block px-4 py-2 hover:bg-gray-200"
                                  onClick={toggleAccountMenu}>My Account</Link>
                            <Link to="/logout" className="block px-4 py-2 hover:bg-gray-200"
                                  onClick={toggleAccountMenu}>Logout</Link>
                        </div>
                    )}
                </div>
            </div>

            <div
                className={`fixed top-0 left-0 w-64 h-full bg-black z-40 transition-transform ${sidebar ? 'translate-x-0' : '-translate-x-full'} duration-300`}>
                <ul className="pt-16">
                    {SidebarData.map((item, index) => (
                        <Submenu item={item} key={index} onItemClick={closeSidebar}/>
                    ))}
                </ul>
            </div>

            {sidebar && (
                <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-30"></div>
            )}
        </>
    );
};

export default Sidebar;
