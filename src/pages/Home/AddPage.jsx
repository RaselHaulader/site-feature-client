import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import { FeatureContext } from '../../providers/featuresProvider';
import CustomSelect from '../Shared/CustomSelect';

export default function AddPage({ site }) {
  const { pages, setPages, pagesOption, setPagesOption, sectionsOption } = useContext(FeatureContext);
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
          setPagesOption([...pagesOption, { value: page.key, label: page.name }])
        }
      })
  }

  const openAddPageModal = () => {
    setDefaultOptions([]);
    pageName.current.value = '';
    pageUrl.current.value = '';
    pageAddModal.current.showModal();
  }

  return (
    <div>
      <button className="btn btn-outline btn-primary w-full" onClick={() => openAddPageModal()}>Add a page</button>
      <dialog id="my_modal_3" ref={pageAddModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div>
            <h2 className='text-center p-1 lg:p-2 text-l uppercase bg-indigo-900'>Add A Page</h2>
            <div className="flex flex-col mb-2 mt-4">
              <span className="mb-2">Page name</span>
              <input type="text" ref={pageName} placeholder="Name" className="input input-bordered" />
            </div>
            <div className="flex flex-col mb-2 mt-8 mb-8">
              <span className="mb-2">Page URL</span>
              <input type="text" ref={pageUrl} placeholder="URL" className="input input-bordered" />
            </div>
            <span className="mt-2 text-center block">Select sections of this page</span>
            <CustomSelect name={"Sections"} options={sectionsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />
            <button onClick={(e) => addPages(e)} className="btn btn-info w-full top-2">Add Page</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
