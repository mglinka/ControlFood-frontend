import {
    AiFillCaretDown,
    AiFillCaretUp,
    AiOutlineMoneyCollect,
    AiOutlineUser,
    AiOutlineFolder,
    AiOutlineBarcode
} from 'react-icons/ai';
import { FaCog, FaOpencart } from 'react-icons/fa';
import { SidebarItem } from '../models/SidebarItem.ts';

export const SidebarData: SidebarItem[] = [
    {
        title: 'Products',
        path: '/products',
        icon: <AiOutlineFolder />,
        iconClosed: <AiFillCaretDown />,
        iconOpened: <AiFillCaretUp />,
        subnav: [
            {
                title: 'Users',
                path: '/overview/users',
                icon: <AiOutlineUser />
            },
            {
                title: 'Revenue',
                path: '/overview/revenue',
                icon: <AiOutlineMoneyCollect />
            }
        ]
    },
    {
        title: 'Allergy Profile',
        path: '/profile',
        icon: <FaOpencart />
    },
    {
        title: 'Scanner EAN',
        path: '/history',
        icon: <AiOutlineBarcode  />
    },
    {
        title: 'Configurations',
        path: '/configurations',
        icon: <FaCog />
    }
];
