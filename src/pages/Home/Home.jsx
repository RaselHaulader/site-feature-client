import { useContext, useEffect, useState } from "react";
import { FeatureContext } from "../../providers/featuresProvider";
import Navbar from "../Shared/Navbar/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import AddPage from "./AddPage";
import AddSections from "../Sections/AddSections";

const Home = ({ site }) => {
    const [currentSite, setCurrentSite] = useState([]);
    const { sites, pages, sectionsOption, componentsOption, siteToggle, setSiteToggle } = useContext(FeatureContext);
    useEffect(() => {
        console.log(currentSite)
        console.log(site)
        currentSite != site.name && setSiteToggle(siteToggle ? false : true)
        console.log('toggle useeffect')
        console.log(siteToggle)
        setCurrentSite(site.name)
        console.log(site.name)
    },[site]) 
    return (
        <>
            <Navbar sites={sites}></Navbar>
            <div className="flex">
                <div className="pages w-full lg:w-1/5">
                    <div className="pages-container">
                        <h2>pages</h2>
                        <ul className="menu">
                            {pages?.map(page => <li><NavLink to={`/${site.name}/page/${site.name.replaceAll(' ', '-') + page.key}?key=${page.key}`}>{page.name}</NavLink></li>)}
                        </ul>
                        <AddPage site={site} />
                    </div>
                    <div>
                        <h2>sections</h2>
                        <ul className="menu">
                            {sectionsOption?.map(section => <li><NavLink to={`/${site.name.replaceAll(' ', '-')}/section/${site.name.replaceAll(' ', '-') + section.value}?key=${section.value}`}>{section.label}</NavLink></li>)}
                        </ul>
                        <AddSections site={site}/>
                    </div>
                    <div className="divider"></div>
                    <div>
                        <h2>components</h2>
                        <ul className="menu">
                            {componentsOption?.map(component => <li><NavLink to={`/${site.name.replaceAll(' ', '-')}/component/${site.name.replaceAll(' ', '-') + component.value}?key=${component.value}`}>{component.label}</NavLink></li>)}
                        </ul>
                    </div>
                    <div className="divider"></div>
                    <div>
                        <h2>History</h2>
                        <ul className="menu">
                            <li><NavLink to={`/holo-taco/history`}>All History</NavLink></li>
                        </ul>
                    </div>
                </div>
                <div className="sections w-full lg:w-4/5">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Home;