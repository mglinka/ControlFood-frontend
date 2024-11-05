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
        role: ['ROLE_USER'],
    },
    {
        title: 'Products',
        path: '/products-specialist',
        icon: <AiOutlineFolder />,
        role: ['ROLE_SPECIALIST'],

    },
    {
        title: 'Allergy Profile',
        path: '/profile',
        icon: <FaOpencart />,
        role: ['ROLE_USER'],
    },
    {
        title: 'Scanner EAN',
        path: '/scanner',
        icon: <AiOutlineBarcode />,
        role: ['ROLE_SPECIALIST', 'ROLE_USER'],
    },
    {
        title: 'Configurations',
        path: '/configurations',
        icon: <FaCog />,
        role: ['ROLE_ADMIN'],
    },
    {
        title: 'Create product',
        path: '/create-product',
        icon:<FaOpencart/>,
        role:['ROLE_SPECIALIST']
    },
    {
        title: 'Create allergen',
        path: '/create-allergen',
        icon:<FaOpencart/>,
        role:['ROLE_SPECIALIST']
    },
    {
        title: 'Accounts',
        path: '/accounts',
        icon:<FaOpencart/>,
        role:['ROLE_ADMIN']
    }
];
