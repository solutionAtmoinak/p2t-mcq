import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { UserRegisterDTO } from "../interface/DTO";

/**
 * Interface for the decoded JWT token structure.
 * Adjust this based on your backend's JWT payload.
 */
interface DecodedUser {
    FirstName: string
    LastName: string
    FranchiseId: number
    Mobile: string
    WhatsApp: string
    email: string
    role: string
    nameid: string
}

/**
 * Custom hook to get and decode user data from localStorage 'token'.
 * @returns The decoded user data or null if no token exists or is invalid.
 */
const useUserData = () => {
    const [userData, setUserData] = useState<UserRegisterDTO>({});

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded = jwtDecode<DecodedUser>(token);
                setUserData({
                    FirstName: decoded.FirstName,
                    LastName: decoded.LastName,
                    FullName: `${decoded.FirstName} ${decoded.LastName}`,
                    FranchiseId: decoded.FranchiseId,
                    PhoneNumber: decoded.Mobile,
                    WhatsAppNumber: decoded.WhatsApp,
                    Email: decoded.email,
                    RoleName: decoded.role,
                    Id: decoded.nameid
                });
            } catch (error) {
                console.error("Failed to decode JWT token:", error);
                setUserData({});
            }
        } else {
            setUserData({});
        }
    }, []);

    return userData;
};

export default useUserData;
