import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Shared/Navbar/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const { googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleGoogleSignIn = () => {
        googleSignIn().then(result => {
            // navigate after login
            navigate('/');
        })
            .catch(error => {
                toast.error('Something wrong', {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.error(error);
            })
    }
    return (
        <div>
            <Navbar></Navbar>
            <p className="text-center mt-4"><button onClick={() => handleGoogleSignIn()} className="bg-violet-600 font-bold p-2 mx-4 rounded-lg">Google SignIn</button></p>
        </div>
    );
};

export default Login;