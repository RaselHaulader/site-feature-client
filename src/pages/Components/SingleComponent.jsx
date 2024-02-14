import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SingleComponent() {
  const [component, setComponent] = useState([])
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const key = searchParams.get('key');
  useEffect(() => {
    axios(`http://localhost:5000/getComponent/${key}`)
      .then((res) => {
        const data = res.data;
        setComponent(data);
        console.log(data)
      })
  }, [key])
  return (
    <div>
      <h2>{component.name}</h2>
        {component.sections?.length > 0 && <>
          <div>
            <h3>Associated Sections</h3>
            <ul>
              {component.sections.map(section => <li>{section.name}</li>)}
            </ul>
          </div></>
        }
    </div>
    
  )
}
