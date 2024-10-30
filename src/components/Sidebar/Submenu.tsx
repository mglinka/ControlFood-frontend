import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarItem } from '../../models/SidebarItem.ts';

type SidebarLinkProps = {
    item: SidebarItem;
    onItemClick: () => void;
};

const Submenu: React.FC<SidebarLinkProps> = ({ item, onItemClick }) => {
    const [subnav, setSubnav] = useState(false);
    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <Link
                to={item.path}
                onClick={() => {
                    showSubnav();
                    onItemClick();
                }}
                className="flex justify-between items-center h-16 text-lg px-4 text-white hover:bg-gray-800 hover:border-l-4 hover:border-orange-700"
            >
                <div className="flex items-center">
                    {item.icon}
                    <span className="ml-4">{item.title}</span>
                </div>
                <div>{item?.subnav && subnav ? item?.iconOpened : item?.iconClosed}</div>
            </Link>
            {subnav &&
                item?.subnav?.map((subnavItem, index) => {
                    return (
                        <Link
                            to={subnavItem.path}
                            key={index}
                            onClick={onItemClick}
                            className="flex items-center h-16 text-lg pl-16 text-white hover:bg-purple-500"
                        >
                            {subnavItem.icon}
                            <span className="ml-4">{subnavItem.title}</span>
                        </Link>
                    );
                })}
        </>
    );
};

export default Submenu;
