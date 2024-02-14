import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const FeatureContext = createContext(null);

const FeaturesProvider = ({ children }) => {
  const [sites, setSites] = useState([]);
  const [pages, setPages] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionsOption, setSectionsOption] = useState([]);
  const [componentsOption, setComponentsOption] = useState([]);
  const [siteToggle, setSiteToggle] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/sites')
      .then((res) => res.json())
      .then((data) => {
        setSites(data)
      })

    const site = window.location.pathname.split('/')[1];
    if (site) {
      console.log('options')
      fetch(`http://localhost:5000/pages/${site}`)
        .then((res) => res.json())
        .then((data) => {
          setPages(data)
        })

      axios(`http://localhost:5000/sections-options/${site}`)
        .then(res => {
          const data = res.data;
          const options = data.map((option) => {
            return { value: option.key, label: option.name }
          })
          setSectionsOption(options);
        })

      axios(`http://localhost:5000/component-options/${site}`)
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
    sectionsOption,
    setSectionsOption,
    siteToggle,
    setSiteToggle,
    componentsOption,
    setComponentsOption
  }

  return (
    <FeatureContext.Provider value={FeaturesInfo}>
      {children}
    </FeatureContext.Provider>
  );
};

export default FeaturesProvider;