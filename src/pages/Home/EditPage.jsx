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
    console.log(defaultSelected)
    setDefaultOptions(defaultSelected);
     pageEditModal.current.showModal();
  }

  useEffect(() => {
    setTitle(page.name);
    setUrl(page.url);
    const defaultSelected = page.sections?.map((section) => ({ value: parseFloat(section.key), label: section.name }));
    console.log(defaultSelected)
    setDefaultOptions(defaultSelected);
    setSelectedOptions(page.sections);
  }, [page])


  const handleEditPage = () => {
    console.log({selectedOptions})
    const editPageData = {
      key: parseFloat(page.key),
      site: page.site,
      name: title,
      url: url,
      sections: selectedOptions
    }
    const currentSections = page.sections;
    const editSections = editPageData.sections;
    console.log({ currentSections });
    console.log({ editSections });
    function findNotMatchedObjects(arr1, arr2) {
      return arr1.filter(obj1 => !arr2.some(obj2 => obj1.key === obj2.key && obj1.name === obj2.name));
    }
    const addedSections = findNotMatchedObjects(editSections, currentSections);
    console.log({ addedSections })

    let removedSections = []
    if (editSections.length < 1) {
      removedSections = currentSections;
    } else if (editSections.length < currentSections.length || editSections.length === currentSections.length) {
      removedSections = findNotMatchedObjects(currentSections, editSections);
    }
    console.log({ removedSections })
    axios.post('http://localhost:5000/editPage', {editPageData, addedSections, removedSections})
      .then(res => {
        console.log(res)
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
          console.log({pageIdx})
          console.log(res.data)
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
            <div className="flex items-center flex-row mb-2 mt-4">
              <span className="label-text  w-1/3">Page name</span>
              <input type="text" onChange={e => setTitle(e.target.value)} value={title} placeholder="Page Name" className="input input-bordered w-2/3 max-w-xs" />
            </div>
            <div className="flex items-center flex-row mb-2">
              <span className="label-text w-1/3">Page URL</span>
              <input type="text" onChange={e => setUrl(e.target.value)} value={url} placeholder="Page Name" className="input input-bordered w-2/3 max-w-xs" />
            </div>
            <span className="mt-2">Select sections of this page</span>
            <CustomSelect name={"Sections For Edit"} options={sectionsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />
            <button onClick={(e) => handleEditPage(e)} className="btn btn-wide top-2">Update</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
