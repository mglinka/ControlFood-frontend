import { FaLeaf } from 'react-icons/fa';

function MainHeader() {
    return (
        <header className="mx-auto w-[85%] my-0 pb-4 text-center flex justify-between items-center border-b-2 border-black">
            <h1 className="text-4xl flex gap-6 items-center text-black pb-1">
                <FaLeaf />
                ControlFood
            </h1>
        </header>
    );
}

export default MainHeader;
