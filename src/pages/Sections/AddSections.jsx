import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FeatureContext } from '../../providers/featuresProvider';
import CustomSelect from '../Shared/CustomSelect';

export default function AddSections({site}) {
  const { sectionsOption, setSectionsOption, componentsOption } = useContext(FeatureContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const sectionAddModal = useRef(null);
  const sectionName = useRef(null);
  const [details, setDetails] = useState('');

  const openAddSectionModal = () => {
    console.log(componentsOption)
    setDefaultOptions([]);
    sectionAddModal.current.showModal();
  }

  const addSection = () => {
    console.log(selectedOptions)
    console.log(sectionName.current.value)
    const section = {
      key: new Date().valueOf(),
      site: site.name,
      name: sectionName.current.value,
      details: details,
      pages: [],
      components: selectedOptions
    }
    if (!sectionName.current.value || !details) {
      return
    }
    console.log(section)
    axios.post('http://localhost:5000/addSection', section)
      .then(res => {
        if (res.data.acknowledged) {
          console.log(res.data)
          setSectionsOption([...sectionsOption, {value: section.key, label: section.name}]);
          sectionAddModal.current.close();
        }
      })
  }
  return (
      <div>
        <button className="btn w-full" onClick={() => openAddSectionModal()}>Add a Section</button>
        <dialog id="my_modal_3" ref={sectionAddModal} className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div>
              <div className="flex items-center flex-row mb-2 mt-4">
                <span className="label-text  w-1/3">Section name</span>
                <input type="text" ref={sectionName} placeholder="Name" className="input input-bordered w-2/3 max-w-xs" />
              </div>
              <ReactQuill theme="snow" value={details} onChange={setDetails} />
              <span className="mt-2">Select components of this sections</span>
              <CustomSelect name={"Components"} options={componentsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />
              <button onClick={(e) => addSection(e)} className="btn btn-wide top-2">Add Section</button>
            </div>
          </div>
        </dialog>
      </div>
  )
}
