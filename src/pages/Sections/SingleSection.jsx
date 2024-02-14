import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FeatureContext } from '../../providers/featuresProvider';
import EditSections from './EditSections';

export default function SingleSection() {
  const { sectionsOption, setSectionsOption } = useContext(FeatureContext);
  const [section, setSection] = useState([])
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const key = searchParams.get('key');
  useEffect(() => {
    axios(`http://localhost:5000/getSection/${key}`)
      .then((res) => {
        const data = res.data;
        setSection(data);
        console.log(data)
      })
  }, [key])

  const handleDeleteSection = () => {
    console.log('section deleted',key)
    axios.post(`http://localhost:5000/deleteSection`, section)
      .then(res => {
        if (res.data.acknowledged) {
          setSectionsOption(sectionsOption.filter(singleSection => singleSection.value != key));
          console.log(sectionsOption.filter(singleSection => singleSection.value != key))
          navigate(`/${window.location.pathname.split('/')[1]}`);
        }
      })
  }

  const handleTestHistory = () => {
    
  }

  return (
    <div>
      <button onClick={() => handleDeleteSection()} className="btn btn-outline btn-error">Delete</button>
      <EditSections section={section} setSection={setSection} />
      <button onClick={() => handleTestHistory()} className="btn btn-outline btn-primary">Tested</button>
      <h2>{section.name}</h2>
      <div>
        <div dangerouslySetInnerHTML={{ __html: section.details }} />
        <div>
          {section.pages?.length > 0 && <>
            <div>
              <h3>Associated Pages</h3>
              <ul>
                {section.pages.map(page => <li>{page.name}</li>)}
              </ul>
            </div></>
          }
          {section.components?.length > 0 && <>
            <div>
              <h3>Associated Components</h3>
              <ul>
                {section.components.map(component => <li>{component.name}</li>)}
              </ul>
            </div></>
          }
        </div>
      </div>
    </div>
  )
}
