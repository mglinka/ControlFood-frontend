import MainHeader from "../MainHeader.tsx";
import {RegisterForm} from "../forms/RegisterForm.tsx";

const RegisterPage: React.FC = () => {

    return (
        <>
            <MainHeader />
            <RegisterForm/>
        </>
    );
};

export default RegisterPage;
