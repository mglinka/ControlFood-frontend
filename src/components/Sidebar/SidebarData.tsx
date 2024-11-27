import {
    AiOutlineFolder,
    AiOutlineBarcode
} from 'react-icons/ai';
import { FaOpencart } from 'react-icons/fa';
import { SidebarItem } from '../../models/SidebarItem.ts';

export const SidebarData: SidebarItem[] = [
    {
        title: 'Produkty',
        path: '/products',
        icon: <AiOutlineFolder />,
        role: ['ROLE_USER'],
    },
    {
        title: 'Produkty',
        path: '/products-specialist',
        icon: <AiOutlineFolder />,
        role: ['ROLE_SPECIALIST'],

    },
    {
        title: 'Profil alergiczny',
        path: '/profile',
        icon: <FaOpencart />,
        role: ['ROLE_USER'],
    },
    {
        title: 'Skaner kodów EAN',
        path: '/scanner',
        icon: <AiOutlineBarcode />,
        role: ['ROLE_SPECIALIST', 'ROLE_USER'],
    },
    {
        title: 'Stwórz produkt',
        path: '/create-product',
        icon:<FaOpencart/>,
        role:['ROLE_SPECIALIST']
    },
    {
        title: 'Alergeny',
        path: '/create-allergen',
        icon:<FaOpencart/>,
        role:['ROLE_SPECIALIST']
    },
    {
        title: 'Konta',
        path: '/accounts',
        icon:<FaOpencart/>,
        role:['ROLE_ADMIN']
    },
    {
        title: 'Poziomy dostępu',
        path: '/access-levels',
        icon:<FaOpencart/>,
        role:['ROLE_ADMIN']
    },
    {
        title: 'Szablony',
        path: '/schemas',
        icon:<FaOpencart/>,
        role:['ROLE_SPECIALIST']
    }
];
