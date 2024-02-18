import React, { useContext, useEffect, useRef, useState } from 'react'
import { FeatureContext } from '../../providers/featuresProvider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import CustomSelect from '../Shared/CustomSelect';

export default function EditComponent({ component, setComponent }) {
  const { sectionsOption, componentsOption, setComponentsOption } = useContext(FeatureContext);
  const componentEditModal = useRef(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [details, setDetails] = useState('');
  const [componentName, setComponentName] = useState('');

  const openEditComponentModal = () => {
    setDetails(component.details)
    componentEditModal.current.showModal();
  }

  useEffect(() => {
    setComponentName(component.name);
    const defaultSelected = component.sections?.map((section) => ({ value: parseFloat(section.key), label: section.name }));
    setDefaultOptions(defaultSelected);
    setSelectedOptions(component.sections);
  }, [component])

  const handleEdit = () => {
    const editComponentData = {
      key: parseFloat(component.key),
      site: component.site,
      name: componentName,
      sections: selectedOptions,
      details: details,
    }
    const currentSections = component.sections;
    const editSections = editComponentData.sections;
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
    axios.post('http://localhost:5000/editComponent', {editComponentData, addedSections, removedSections})
    .then(res => {
      if (res.data.acknowledged) {
        let componentIdx;
        componentsOption.forEach((singleComponent, idx) => {
          if (singleComponent.value == component.key) {
            componentIdx = idx;
          }
        })
        const allComponents = [...componentsOption];
        allComponents[componentIdx] = { value: editComponentData.key, label: editComponentData.name }
        setComponentsOption(allComponents);
        setComponent(editComponentData);
        componentEditModal.current.close();
      }
    })
  }
  return (
    <div>
      <button className="btn btn-outline btn-info mr-4" onClick={() => openEditComponentModal()}>Edit Component</button>
      <dialog id="my_modal_3" ref={componentEditModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div>
          <div className="flex flex-col mb-2 mt-4 mb-8">
              <span className="mb-2">Component name</span>
              <input type="text" onChange={e => setComponentName(e.target.value)} value={componentName} placeholder="Name" className="input input-bordered w-2/3 max-w-xs" />
            </div>
            <span className="mb-2 block mt-8">Edit details of this Component</span>
            <ReactQuill theme="snow" value={details} onChange={setDetails} />

            <CustomSelect name={"Sections"} options={sectionsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />

            <button onClick={(e) => handleEdit(e)} className="btn btn-wide top-2">Update Component</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
