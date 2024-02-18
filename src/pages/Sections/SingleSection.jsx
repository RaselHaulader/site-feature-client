import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { FeatureContext } from '../../providers/featuresProvider';
import EditSections from './EditSections';
import Swal from 'sweetalert2';
import SectionHistory from '../History/SectionHistory';

export default function SingleSection() {
  const { currentSite, sectionsOption, setSectionsOption } = useContext(FeatureContext);
  const [section, setSection] = useState([])
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const key = searchParams.get('key');
  useEffect(() => {
    setLoading(true);
    axios(`http://localhost:5000/getSection/${key}`)
      .then((res) => {
        const data = res.data;
        setSection(data);
        setLoading(false);
      })
  }, [key])

  const handleDeleteSection = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`http://localhost:5000/deleteSection`, section)
          .then(res => {
            if (res.data.acknowledged) {
              setSectionsOption(sectionsOption.filter(singleSection => singleSection.value != key));
              navigate(`/${window.location.pathname.split('/')[1]}`);
              Swal.fire({
                title: "Deleted!",
                text: `${section.name} has been deleted.`,
                icon: "success"
              });
            }
          })
      }
    });
  }

  return (
    <div className='px-4'>
      <h1 className='text-center p-1 lg:p-2 text-l uppercase  bg-indigo-900'>Section</h1>
      {loading ? <div className='text-center mt-8'><span className="loading loading-spinner loading-md"></span></div> : <>
        <div className='header flex justify-between items-center px-4 my-4'>
          <h2 className='text-l grow flex-none max-w-2xl text-center'>{section.name}</h2>
          <div className="buttons flex-none max-w-sm flex">
            <EditSections section={section} setSection={setSection} />
            <button onClick={() => handleDeleteSection()} className="btn btn-outline btn-error">Delete</button>
          </div>
        </div>
        <div className="divider"></div>
        <p className='text-right mb-2'><SectionHistory section={section} /></p>
        <div className='flex flex-col lg:flex-row'>
          <div className='w-full lg:w-3/5 details'>
            <div dangerouslySetInnerHTML={{ __html: section.details }} />
          </div>
          {section.pages?.length > 0 && <div className='w-full border-0 lg:border-l border-slate-700 lg:w-1/5 ps-3'>
            <h2>Associated Pages</h2>
            {
              section.pages?.map((page, idx) => {
                return <>
                  <li><NavLink to={`/${currentSite}/page/${currentSite + page.key}?key=${page.key}`}>{page.name}</NavLink></li>
                </>
              })
            }
          </div>
          }
          {section.components?.length > 0 && <div className='w-full border-0 lg:border-l border-slate-700 lg:w-1/5 ps-3'>
            <h2>Associated Components</h2>
            {
              section.components?.map(component => {
                return <>
                  <li><NavLink to={`/${currentSite}/component/${currentSite + component.key}?key=${component.key}`}>{component.name}</NavLink></li>
                </>
              })
            }
          </div>}
        </div></>
      }
    </div>
  )
}
