import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from '../Shared/Navbar/Navbar';
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const { createUser, googleSignIn} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleGoogleSignIn = () => {
        googleSignIn().then(result => {
            // navigate after login
            navigate(location?.state ? location.state : '/');
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
    const handleRegister = e => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        const name = form.get('name');
        const photo = form.get('photo');
        const email = form.get('email');
        const password = form.get('password');
        const specialChar = /.*[!@#$%^&*()_+=[\]{};:'"<>,.?/|\\`~].*/;
        const capitalChar = /.*[A-Z].*/;
        let toastStyle = {
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        if (password.length < 6) {
            toast.warn("Password should more than 6 characters.", toastStyle);
            return
        } else if (!specialChar.test(password)) {
            toast.warn("Password should have a special characters.", toastStyle);
            return
        } else if (!capitalChar.test(password)) {
            toast.warn("Password should have a Capital characters.", toastStyle);
            return
        }
        createUser(email, password)
            .then(result => {
                navigate(location?.state ? location.state : '/');
            })
            .catch(error => {
                console.error(error)
                toast.warn(`${error}`, toastStyle);
            })

    }

    return (
        <div>
            <Navbar></Navbar>
            <div>
                <h2 className="text-4xl my-10 text-center">Please Register</h2>
                <form onSubmit={handleRegister} className=" md:w-3/4 lg:w-1/2 mx-auto">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input type="text" required name="name" placeholder="Name" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Photo URL</span>
                        </label>
                        <input type="text" required name="photo" placeholder="Photo URL" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" required name="email" placeholder="Email" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" required name="password" placeholder="Password" className="input input-bordered" />
                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                        </label>
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary bg-violet-600">Register</button>
                    </div>
                </form>
                <p className="text-center mt-4">Already have an account? <Link className="text-blue-600 font-bold" to="/login">Login</Link>  <button onClick={() => handleGoogleSignIn()} className="text-red-600 font-bold">Google SignIn</button></p>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default Register;