import {
    AiOutlineFolder,
    AiOutlineBarcode
} from 'react-icons/ai';
import { FaCog, FaOpencart } from 'react-icons/fa';
import { SidebarItem } from '../../models/SidebarItem.ts';

export const SidebarData: SidebarItem[] = [
    {
        title: 'Products',
        path: '/products',
        icon: <AiOutlineFolder />,

    },
    {
        title: 'Allergy Profile',
        path: '/profile',
        icon: <FaOpencart />
    },
    {
        title: 'Scanner EAN',
        path: '/scanner',
        icon: <AiOutlineBarcode  />
    },
    {
        title: 'Configurations',
        path: '/configurations',
        icon: <FaCog />
    }
];
