import {
    AiOutlineFolder,
    AiOutlineBarcode
} from 'react-icons/ai';
import { FaCog, FaOpencart } from 'react-icons/fa';
import { SidebarItem } from '../../models/SidebarItem.ts';

// Define the roles that can access each item
export const SidebarData: SidebarItem[] = [
    {
        title: 'Products',
        path: '/products',
        icon: <AiOutlineFolder />,
        role: ['ROLE_ADMIN', 'ROLE_SPECIALIST', 'ROLE_USER'], // Accessible by all roles
    },
    {
        title: 'Allergy Profile',
        path: '/profile',
        icon: <FaOpencart />,
        role: ['ROLE_ADMIN', 'ROLE_SPECIALIST', 'ROLE_USER'],
    },
    {
        title: 'Scanner EAN',
        path: '/scanner',
        icon: <AiOutlineBarcode />,
        role: ['ROLE_ADMIN', 'ROLE_SPECIALIST', 'ROLE_USER'],
    },
    {
        title: 'Configurations',
        path: '/configurations',
        icon: <FaCog />,
        role: ['ROLE_ADMIN'],
    }
];
