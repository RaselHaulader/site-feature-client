import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import { useEffect } from 'react';
import { FeatureContext } from '../../providers/featuresProvider';
import { NavLink } from 'react-router-dom';
import SectionHistory from '../History/SectionHistory';
import { AuthContext } from '../../providers/AuthProvider';
import AddSectionHistory from '../History/AddSectionHistory';

export default function SectionAccordion({ section, page }) {
  const { currentSite } = useContext(FeatureContext);
  const { user } = useContext(AuthContext);
  const [sectionData, setSectionData] = useState('');
  const [loading, setLoading] = useState(false);
  const collapse = useRef(null);

  useEffect(() => {
    setLoading(false)
    setSectionData('');
    collapse.current.classList.add('collapse-close');
    console.log('render accordion')
  }, [page])

  const getSectionData = (key, e) => {
    let dataExist = sectionData;
    if (dataExist) {
      setSectionData('');
      collapse.current.classList.add('collapse-close');
    }
    !dataExist && setLoading(true);
    !dataExist && axios(`http://localhost:5000/getSection/${key}`)
      .then((res) => {
        const data = res.data;
        setSectionData(data);
        collapse.current.classList.remove('collapse-close')
        console.log(collapse.current)
        e.target.checked = true;
        console.log(data)
        setLoading(false);
      })
  }

  return (
    <div className='mb-2'>
      <div ref={collapse} className="collapse collapse-close collapse-arrow bg-base-200">
        <input type="checkbox" className='cursor-pointer' onClick={(e) => getSectionData(section.key, e)} />
        <div className="collapse-title text-l font-medium cursor-pointer">
          <h2 className='capitalize flex'><span className='flex-none max-w-2xl'>{section.name}</span>{loading && <span className='grow text-center'><span className="loading loading-dots loading-md"></span></span>}</h2>
        </div>
        <div className="collapse-content">
          <div className="divider mt-0 mb-1"></div>
          <p className='text-right pe-4 mb-3'><NavLink className='px-2 py-1 min-h-7 btn btn-outline btn-info' to={`/${currentSite}/section/${currentSite + section.key}?key=${section.key}`}> Section</NavLink> <AddSectionHistory section={section} user={{ userName: user.displayName, userEmail: user.email }} pageName={page.name} /> <SectionHistory section={section} /> </p>
          <div className='flex flex-col lg:flex-row'>
            <div className='w-full lg:w-3/5 '>
              <div dangerouslySetInnerHTML={{ __html: sectionData.details }} />
            </div>
            {sectionData.pages?.length > 0 && <div className='w-full border-0 lg:border-l border-slate-700 lg:w-1/5 ps-3'>
              <h2>Associated Pages</h2>
              {
                sectionData.pages?.map((page, idx) => {
                  return <>
                    <li><NavLink to={`/${currentSite}/page/${currentSite + page.key}?key=${page.key}`}>{page.name}</NavLink></li>
                  </>
                })
              }
            </div>
            }
            {sectionData.components?.length > 0 && <div className='w-full border-0 lg:border-l border-slate-700 lg:w-1/5 ps-3'>
              <h2>Associated Components</h2>
              {
                sectionData.components?.map(component => {
                  return <>
                    <li><NavLink to={`/${currentSite}/component/${currentSite + component.key}?key=${component.key}`}>{component.name}</NavLink></li>
                  </>
                })
              }
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
