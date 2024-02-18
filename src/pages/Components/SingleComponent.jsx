import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { FeatureContext } from '../../providers/featuresProvider';
import EditComponent from './EditComponent';
import Swal from 'sweetalert2';

export default function SingleComponent() {
  const { currentSite, componentsOption, setComponentsOption } = useContext(FeatureContext);
  const [component, setComponent] = useState([])
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const key = searchParams.get('key');
  useEffect(() => {
    setLoading(true);
    axios(`http://localhost:5000/getComponent/${key}`)
      .then((res) => {
        const data = res.data;
        setComponent(data);
        setLoading(false);
      })
  }, [key])

  const handleDeleteComponent = () => {
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
        axios.post(`http://localhost:5000/deleteComponent`, component)
          .then(res => {
            if (res.data.acknowledged) {
              setComponentsOption(componentsOption.filter(singleComponent => singleComponent.value != key));
              navigate(`/${window.location.pathname.split('/')[1]}`);
              Swal.fire({
                title: "Deleted!",
                text: `${component.name} has been deleted.`,
                icon: "success"
              });
            }
          })
      }
    });
  }

  return (
    <div className='px-4'>
      <h1 className='text-center p-1 lg:p-2 text-l uppercase bg-indigo-900'>Component</h1>
      {
        loading ? <div className='text-center mt-8'>
          <span className="loading loading-spinner loading-md"></span></div> : <><div className='header flex justify-between items-center px-4 my-4'>
            <h2 className='text-l grow flex-none max-w-2xl text-center'>{component.name}</h2>
            <div className="buttons flex-none max-w-sm flex">
              <EditComponent component={component} setComponent={setComponent} />
              <button onClick={() => handleDeleteComponent()} className="btn btn-outline btn-error">Delete</button>
            </div>
          </div>
          <div className="divider"></div>
          <div className='flex flex-col lg:flex-row'>
            <div className='w-full lg:w-3/4 details'>
              <div dangerouslySetInnerHTML={{ __html: component.details }} />
            </div>
            <div className='w-full border-0 lg:border-l border-slate-700 lg:w-1/4 ps-3'>
              <h3>Associated Sections</h3>
              {
                component.sections?.map(section => {
                  return <>
                    <li><NavLink to={`/${currentSite}/section/${currentSite + section.key}?key=${section.key}`}>{section.name}</NavLink></li>
                  </>
                })
              }
            </div>
          </div></>
      }
    </div>

  )
}
