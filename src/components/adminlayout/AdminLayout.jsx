
import { Outlet } from 'react-router-dom';



// import dashboardusers from '../../assets/images/icons/dashboard_users.png';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useState } from 'react'
import Dashboard from '../../pages/dashboard/Dashboard';
// import TotalAdminChart from '../charts/TotalAdminChart'

const AdminLayout = () => {
    const [isToggle, setIs_Toggle] = useState(true)
    return (
        <>
            <div className={`flex w-full ${isToggle ? null : 'side_menu'}`}>
                <Sidebar isToggle={isToggle} />
                <div className='w-full'>
                    <Header setIs_Toggle={setIs_Toggle} isToggle={isToggle} className="fixed top-0" />
                    <Outlet/>
                </div>
            </div>

        </>
    );
}

export default AdminLayout;