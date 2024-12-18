import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import axiosInstance from "../api/axiosConfig.ts";
import {toast} from "react-toastify";
import {useAuth} from "../utils/AuthContext.tsx";

export const AmazonLoginButton = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const handleLoginClick = () => {
        let options = {
            scope: "profile",
            scope_data: {
                'profile' : {'essential': false}
            },
            pkce: true,
        }
        //@ts-ignore
        window.amazon.Login.authorize(options, function(response) {
            if ( response.error ) {
                alert('oauth error ' + response.error);
                return;
            }
            //@ts-ignore
            window.amazon.Login.retrieveToken(response.code, async function (response) {
                if (response.error) {
                    alert('oauth error ' + response.error);
                    return;
                }
                const amazon_response = await axiosInstance.post("/auth/amazon/redirect", response.access_token)
                console.log("Bartini", amazon_response);
                console.log("B", amazon_response.data.token)
                login(amazon_response.data.token)

                // login(backendToken);
                toast.success('Logowanie przez Google powiodło się');
                setTimeout(() => navigate('/main-page'), 700);
            });
        });
    };
    useEffect(() => {
        console.table(searchParams);
    }, [searchParams]);
    return <button
        onClick={handleLoginClick}
        id="LoginWithAmazon"
        className={"border-[1px] border-gray-200 w-full py-2 text-sm hover:bg-slate-50"}
    >
        <div className={"flex px-2"}>

            <img className={"h-6"}
                 src="https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png" alt="asd"/>
            <div className={"w-full flex"}>
                                    <span className={"mx-auto my-auto"}>
                            Zaloguj się przez Amazon
                                    </span>
            </div>
        </div>
    </button>;
};