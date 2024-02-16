import React, { useContext, useRef, useState } from 'react'
import { FeatureContext } from '../../providers/featuresProvider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import CustomSelect from '../Shared/CustomSelect';

export default function AddComponent({ site }) {
  const { sectionsOption, componentsOption, setComponentsOption } = useContext(FeatureContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const componentAddModal = useRef(null);
  const componentName = useRef(null);
  const [details, setDetails] = useState('');

  const openAddComponentModal = () => {
    componentName.current.value = '';
    setDetails('');
    setDefaultOptions([]);
    componentAddModal.current.showModal();
  }

  const addComponent = () => {
    const component = {
      key: new Date().valueOf(),
      site: site.name,
      name: componentName.current.value,
      sections: selectedOptions,
      details: details,
    }
    if (!componentName.current.value || !details) {
      return
    }
    console.log(component)
    axios.post('http://localhost:5000/addComponent', component)
      .then(res => {
        if (res.data.acknowledged) {
          console.log(res.data)
          setComponentsOption([...componentsOption, { value: component.key, label: component.name }]);
          componentAddModal.current.close();
        }
      })
  }

  return (
    <div>
      <button className="btn btn-outline btn-primary w-full" onClick={() => openAddComponentModal()}>Add a Component</button>
      <dialog id="my_modal_3" ref={componentAddModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div>
            <div className="flex items-center flex-row mb-2 mt-4">
              <span className="label-text  w-1/3">Component name</span>
              <input type="text" ref={componentName} placeholder="Name" className="input input-bordered w-2/3 max-w-xs" />
            </div>
            <ReactQuill theme="snow" value={details} onChange={setDetails} />
            <CustomSelect name={"Sections"} options={sectionsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />
            <button onClick={(e) => addComponent(e)} className="btn btn-wide top-2">Add Component</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
