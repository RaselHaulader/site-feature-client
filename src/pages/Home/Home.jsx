import { useContext, useEffect, useState } from "react";
import { FeatureContext } from "../../providers/featuresProvider";
import Navbar from "../Shared/Navbar/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import AddPage from "./AddPage";
import AddSections from "../Sections/AddSections";
import AddComponent from "../Components/AddComponent";
import { AuthContext } from "../../providers/AuthProvider";

const Home = ({ site }) => {
    const [currentSite, setCurrentSite] = useState([]);
    const { user } = useContext(AuthContext);
    const { sites, pages, sectionsOption, componentsOption, siteToggle, setSiteToggle } = useContext(FeatureContext);
    useEffect(() => {
        currentSite != site.name && setSiteToggle(siteToggle ? false : true)
        setCurrentSite(site.name)
    }, [site])
    return (
        <>
            <Navbar sites={sites}></Navbar>
            <div className="flex flex-col lg:flex-row mt-3">
                <div className="left-side-menu ps-2 w-full lg:w-1/5">
                    <div>
                        {
                            user?.role === 'admin' && <div>
                                <div className="text-center p-1 lg:p-2 text-l uppercase  bg-indigo-950">Admin</div>
                                <ul className="menu"><li><NavLink to={`/${site.name}/admin`}>All Users</NavLink></li></ul>
                            </div>
                        }
                    </div>
                    <div className="pages-container">
                        <h2 className="text-center p-1 lg:p-2 text-l uppercase  bg-indigo-950">pages</h2>
                        <ul className="menu">
                            {pages?.map(page => <li><NavLink to={`/${site.name}/page/${site.name.replaceAll(' ', '-') + page.key}?key=${page.key}`}>{page.name}</NavLink></li>)}
                        </ul>
                        <AddPage site={site} />
                    </div>
                    <div className="divider"></div>
                    <div>
                        <h2 className="text-center p-1 lg:p-2 text-l uppercase  bg-indigo-950">sections</h2>
                        <ul className="menu">
                            {sectionsOption?.map(section => <li><NavLink to={`/${site.name.replaceAll(' ', '-')}/section/${site.name.replaceAll(' ', '-') + section.value}?key=${section.value}`}>{section.label}</NavLink></li>)}
                        </ul>
                        <AddSections site={site} />
                    </div>
                    <div className="divider"></div>
                    <div>
                        <h2 className="text-center p-1 lg:p-2 text-l uppercase  bg-indigo-950">Components</h2>
                        <ul className="menu">
                            {componentsOption?.map(component => <li><NavLink to={`/${site.name.replaceAll(' ', '-')}/component/${site.name.replaceAll(' ', '-') + component.value}?key=${component.value}`}>{component.label}</NavLink></li>)}
                        </ul>
                        <AddComponent site={site} />
                    </div>
                    <div className="divider"></div>
                    <div>
                        <h2 className="text-center p-1 lg:p-2 text-l uppercase  bg-indigo-950">History</h2>
                        <ul className="menu">
                            <li><NavLink to={`/${site.name.replaceAll(' ', '-')}/history`}>All History</NavLink></li>
                        </ul>
                    </div>
                </div>
                <div className="right-side-info w-full lg:w-4/5">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Home;