import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import { FeatureContext } from '../../providers/featuresProvider';
import CustomSelect from '../Shared/CustomSelect';

export default function AddPage({site}) {
  const { pages, setPages, sectionsOption } = useContext(FeatureContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const pageName = useRef(null);
  const pageUrl = useRef(null);
  const pageAddModal = useRef(null);

  const addPages = () => {
    const page = {
      key: new Date().valueOf(),
      site: site.name,
      name: pageName.current.value,
      url: pageUrl.current.value,
      sections: selectedOptions
    }
    if (!pageName.current.value || !pageUrl.current.value) {
      return
    }
    console.log(page)
    axios.post('http://localhost:5000/addPage', page)
      .then(res => {
        if (res.data.acknowledged) {
          console.log(res.data)
          setPages([...pages, page]);
          pageAddModal.current.close();
        }
      })
  }

  const openAddPageModal = () => {
    setDefaultOptions([]);
    pageAddModal.current.showModal();
  }

  return (
    <div>
      <button className="btn w-full" onClick={() => openAddPageModal()}>Add a page</button>
      <dialog id="my_modal_3" ref={pageAddModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div>
            <div className="flex items-center flex-row mb-2 mt-4">
              <span className="label-text  w-1/3">Page name</span>
              <input type="text" ref={pageName} placeholder="Name" className="input input-bordered w-2/3 max-w-xs" />
            </div>
            <div className="flex items-center flex-row mb-2">
              <span className="label-text w-1/3">Page URL</span>
              <input type="text" ref={pageUrl} placeholder="URL" className="input input-bordered w-2/3" />
            </div>
            <span className="mt-2">Select sections of this page</span>
            <CustomSelect name={"Sections"} options={sectionsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />
            <button onClick={(e) => addPages(e)} className="btn btn-wide top-2">Add Page</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
