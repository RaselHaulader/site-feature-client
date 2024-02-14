import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import SectionAccordion from './SectionAccordion';
import { FeatureContext } from '../../providers/featuresProvider';
import EditPage from '../Home/EditPage';

export default function AllSection() {
  const [searchParams] = useSearchParams();
  const [pageSections, setPageSections] = useState([]);
  const [page, setPage] = useState([]);
  const key = searchParams.get('key');
  const navigate = useNavigate();
  const { setPages, pages } = useContext(FeatureContext);
  useEffect(() => {
    axios(`http://localhost:5000/page-sections/${key}`)
      .then((res) => {
        const data = res.data;
        console.log(data)
        setPageSections(data.sections)
        setPage(data)
      })
  }, [key, pages])

  const handleDeletePage = () => {
    console.log('page deleted')
    axios.post(`http://localhost:5000/deletePage`, page)
      .then(res => {
        if (res.data.result.acknowledged && res.data.updatedDocuments.acknowledged) {
          setPages(pages.filter(singlePage => singlePage.key != key));
          navigate(`/${window.location.pathname.split('/')[1]}`);
        }
      })
  }

  return (
    <div>
      <div className='header'>
        <h2>YOu are viewing all section of {page.name} page.</h2>
        <div className="buttons">
          <EditPage page={page} />
          <button onClick={() => handleDeletePage()} className="btn btn-outline btn-error">Delete</button>
        </div>
      </div>

      {pageSections?.map((section) => {
        return <SectionAccordion section={section} />
      })}
    </div>
  )
}
