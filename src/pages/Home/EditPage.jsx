import React, { useContext, useEffect, useRef, useState } from 'react'
import CustomSelect from '../Shared/CustomSelect';
import { FeatureContext } from '../../providers/featuresProvider';
import axios from 'axios';

export default function EditPage({ page }) {
  const { sectionsOption, pages, setPages } = useContext(FeatureContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const pageEditModal = useRef(null);

  const openEditPageModal = () => {
    const defaultSelected = page.sections?.map((section) => ({ value: parseFloat(section.key), label: section.name }));
    setDefaultOptions(defaultSelected);
    pageEditModal.current.showModal();
  }

  useEffect(() => {
    setTitle(page.name);
    setUrl(page.url);
    const defaultSelected = page.sections?.map((section) => ({ value: parseFloat(section.key), label: section.name }));
    setDefaultOptions(defaultSelected);
    setSelectedOptions(page.sections);
  }, [page])


  const handleEditPage = () => {
    const editPageData = {
      key: parseFloat(page.key),
      site: page.site,
      name: title,
      url: url,
      sections: selectedOptions
    }
    const currentSections = page.sections;
    const editSections = editPageData.sections;
    function findNotMatchedObjects(arr1, arr2) {
      return arr1.filter(obj1 => !arr2.some(obj2 => obj1.key === obj2.key && obj1.name === obj2.name));
    }
    const addedSections = findNotMatchedObjects(editSections, currentSections);

    let removedSections = []
    if (editSections.length < 1) {
      removedSections = currentSections;
    } else if (editSections.length < currentSections.length || editSections.length === currentSections.length) {
      removedSections = findNotMatchedObjects(currentSections, editSections);
    }
    axios.post('https://site-features.onrender.com/editPage', { editPageData, addedSections, removedSections })
      .then(res => {
        if (res.data.acknowledged) {
          let pageIdx;
          pages.forEach((singlePage, idx) => {
            if (singlePage.key == page.key) {
              pageIdx = idx;
            }
          })
          const allPages = [...pages];
          allPages[pageIdx] = editPageData;
          setPages(allPages);
          pageEditModal.current.close();
        }
      })
  }
  return (
    <div>
      <button className="btn btn-outline btn-info ms-2" onClick={() => openEditPageModal()}>Edit Page</button>
      <dialog id={`select-modal-${page.name}`} ref={pageEditModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className="mt-4">
            <h2 className='text-center p-1 lg:p-2 text-l uppercase bg-indigo-900'>Edit Page</h2>
            <div className="flex flex-col mb-2 mt-4">
              <span className="label-text mb-2">Page name</span>
              <input type="text" onChange={e => setTitle(e.target.value)} value={title} placeholder="Page Name" className="input input-bordered" />
            </div>
            <div className="flex flex-col mb-2 mt-8 mb-8">
              <span className="label-text mb-2">Page URL</span>
              <input type="text" onChange={e => setUrl(e.target.value)} value={url} placeholder="Page Name" className="input input-bordered" />
            </div>
            <CustomSelect name={"Sections For Edit"} options={sectionsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />
            <button onClick={(e) => handleEditPage(e)} className="btn btn-info w-full top-2">Update</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
