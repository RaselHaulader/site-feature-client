import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FeatureContext } from '../../providers/featuresProvider';
import CustomSelect from '../Shared/CustomSelect';

export default function AddSections({ site }) {
  const { pagesOption, sectionsOption, setSectionsOption, componentsOption } = useContext(FeatureContext);
  const [selectedPageOptions, setSelectedPageOptions] = useState([]);
  const [defaultPageOptions, setDefaultPageOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const sectionAddModal = useRef(null);
  const sectionName = useRef(null);
  const [details, setDetails] = useState('');

  const openAddSectionModal = () => {
    sectionName.current.value = '';
    setDetails('');
    setDefaultOptions([]);
    setDefaultPageOptions([])
    sectionAddModal.current.showModal();
  }

  const addSection = () => {
    const section = {
      key: new Date().valueOf(),
      site: site.name,
      name: sectionName.current.value,
      details: details,
      pages: selectedPageOptions,
      components: selectedOptions
    }
    if (!sectionName.current.value || !details) {
      return
    }
    axios.post('http://localhost:5000/addSection', section)
      .then(res => {
        if (res.data.acknowledged) {
          setSectionsOption([...sectionsOption, { value: section.key, label: section.name }]);
          sectionAddModal.current.close();
        }
      })
  }
  return (
    <div>
      <button className="btn btn-outline btn-primary w-full" onClick={() => openAddSectionModal()}>Add a Section</button>
      <dialog id="my_modal_3" ref={sectionAddModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div>
            <h2 className='text-center p-1 lg:p-2 text-l uppercase bg-indigo-900'>Add A Section</h2>
            <div className="flex flex-col mb-2 mt-4">
              <span className="mb-2">Section name</span>
              <input type="text" ref={sectionName} placeholder="Name" className="input input-bordered" />
            </div>
            
            <span className="mb-2 block mt-8">Add details of this section</span>
            <ReactQuill theme="snow" value={details} onChange={setDetails} />
            
            <CustomSelect name={"Pages"} options={pagesOption} setSelectedOptions={setSelectedPageOptions} defaultSelectedOptions={defaultPageOptions} />

            <CustomSelect name={"Components"} options={componentsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />
            <button onClick={(e) => addSection(e)} className="btn btn-info w-full top-2">Add Section</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
