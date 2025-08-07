import login_pc from '../../assets/images/login.png'
import Sign_in from '../../pages/auth/Sign_in';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="flex">
            <Outlet />
            <div className="w-full bg-[#F3F4F8] h-screen p-4 flex items-center justify-center relative overflow-hidden">

                <img src={login_pc} alt="Background" className="w-[75%] " />

            </div>
        </div>


    );
}

export default AuthLayout;