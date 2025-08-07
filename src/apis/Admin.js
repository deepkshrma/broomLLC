import axios from "axios"
import { BASE_URL } from "../config/Config"


const loginAdmin =async (data)=>{
try {
    const response = await axios.post(`${BASE_URL}/admin/login-admin`, data)
    return response    
} catch (error) {
    return error
}
}

export { loginAdmin }