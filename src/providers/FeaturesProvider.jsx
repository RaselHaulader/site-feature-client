import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const FeatureContext = createContext(null);

const FeaturesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [sites, setSites] = useState([]);
  const [pages, setPages] = useState([]);
  const [sections, setSections] = useState([]);
  const [pagesOption, setPagesOption] = useState([]);
  const [sectionsOption, setSectionsOption] = useState([]);
  const [componentsOption, setComponentsOption] = useState([]);
  const [currentSite, setCurrentSite] = useState([]);
  const [siteToggle, setSiteToggle] = useState(true);

  useEffect(() => {
    fetch('https://site-features.onrender.com/sites')
      .then((res) => res.json())
      .then((data) => {
        setSites(data)
      })

    const site = window.location.pathname.split('/')[1];
    if (site) {
      setCurrentSite(site);
      axios(`https://site-features.onrender.com/pages/${site}`)
        .then(res => {
          const data = res.data;
          setPages(data)
        })

      axios(`https://site-features.onrender.com/pages-options/${site}`)
        .then(res => {
          const data = res.data;
          const options = data.map((option) => {
            return { value: option.key, label: option.name }
          })
          setPagesOption(options);
        })

      axios(`https://site-features.onrender.com/sections-options/${site}`)
        .then(res => {
          const data = res.data;
          const options = data.map((option) => {
            return { value: option.key, label: option.name }
          })
          setSectionsOption(options);
        })

      axios(`https://site-features.onrender.com/component-options/${site}`)
        .then(res => {
          const data = res.data;
          const options = data.map((option) => {
            return { value: option.key, label: option.name }
          })
          setComponentsOption(options);
        })
    }
  }, [siteToggle]);

  const FeaturesInfo = {
    sites,
    setSites,
    pages,
    setPages,
    sections,
    setSections,
    pagesOption,
    setPagesOption,
    sectionsOption,
    setSectionsOption,
    siteToggle,
    setSiteToggle,
    componentsOption,
    setComponentsOption,
    currentSite
  }

  return (
    <FeatureContext.Provider value={FeaturesInfo}>
      {children}
    </FeatureContext.Provider>
  );
};

export default FeaturesProvider;