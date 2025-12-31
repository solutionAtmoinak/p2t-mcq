import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthenticateUserMutation } from "../../Api/authApi";
import ApiResponse from "../../interface/ApiResponse";

export const isValidJWT = (token: string): boolean => {
    try {
        // JWT has 3 parts separated by dots
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        // Check if each part is valid base64
        parts.forEach(part => {
            // Add padding if needed
            const padded = part + '='.repeat((4 - part.length % 4) % 4);
            atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
        });
        return true;
    } catch (error) {
        return false;
    }
};

const TokenLogin = () => {
    const { jwt: jwtParam } = useParams();


    const navigate = useNavigate();
    const [authenticateApi, { }] = useAuthenticateUserMutation()

    useEffect(() => {


        const jwtToken = jwtParam || "";

        if (jwtToken) {
            if (isValidJWT(jwtToken)) {
                authenticateApi(jwtToken).then((res) => {
                    if (res.data) {
                        const data: ApiResponse = res.data
                        if (data.isSuccess) {
                            localStorage.setItem('token', jwtToken)
                            navigate("/HomePage")
                        } else {
                            navigate('/')
                        }
                    } else {
                        console.log(res.error);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
        navigate('/')
    }, [jwtParam, navigate])


    return (
        <div className="flex items-center justify-center my-auto p-4">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Validating...</p>
            </div>
        </div>
    )
}

export default TokenLogin