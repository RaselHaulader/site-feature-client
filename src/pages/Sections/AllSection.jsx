import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import SectionAccordion from './SectionAccordion';
import { FeatureContext } from '../../providers/featuresProvider';
import EditPage from '../Home/EditPage';
import Swal from 'sweetalert2';

export default function AllSection() {
  const [searchParams] = useSearchParams();
  const [pageSections, setPageSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState([]);
  const key = searchParams.get('key');
  const navigate = useNavigate();
  const { setPages, pages, pagesOption, setPagesOption } = useContext(FeatureContext);
  useEffect(() => {
    setLoading(true)
    axios(`https://site-features.onrender.com/page-sections/${key}`)
      .then((res) => {
        const data = res.data;
        setPageSections(data.sections)
        setPage(data)
        setLoading(false)
      })
  }, [key, pages])

  const handleDeletePage = () => {
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
        axios.post(`https://site-features.onrender.com/deletePage`, page)
          .then(res => {
            if (res.data.result.acknowledged && res.data.updatedDocuments.acknowledged) {
              setPages(pages.filter(singlePage => singlePage.key != key));
              setPagesOption(pagesOption.filter(singlePage => singlePage.value != key))
              navigate(`/${window.location.pathname.split('/')[1]}`);
              Swal.fire({
                title: "Deleted!",
                text: `${page.name} has been deleted.`,
                icon: "success"
              });
            }
          })
      }
    });
  }

  return (
    <div className='px-4'>
      <h1 className='text-center p-1 lg:p-2 text-l uppercase  bg-indigo-900'>Page Sections</h1>
      {loading ? <div className='text-center mt-8'><span className="loading loading-spinner loading-md"></span></div> : <>
        <div className='header flex justify-between items-center mt-4'>
          <h2 className='text-l grow flex-none max-w-2xl text-center'>All section of {page.name} page.</h2>
          <div className="buttons flex-none max-w-sm flex">
            <a className='btn btn-outline btn-success' href={page.url} target='_blank'>Page Live Preview</a>
            <EditPage page={page} />
            <button onClick={() => handleDeletePage()} className="btn ms-2 btn-outline btn-error">Delete</button>
          </div>
        </div>
        <div className="divider"></div>
        <div className='mt-4'>
          {pageSections?.map((section) => {
            return <SectionAccordion section={section} page={page} />
          })}
        </div></>
      }
    </div>
  )
}
