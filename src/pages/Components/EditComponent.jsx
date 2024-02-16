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
    console.log(defaultSelected)
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
    console.log({editComponentData})
    const currentSections = component.sections;
    const editSections = editComponentData.sections;
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
    console.log({removedSections})
    axios.post('http://localhost:5000/editComponent', {editComponentData, addedSections, removedSections})
    .then(res => {
      console.log(res)
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
        console.log(res.data)
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
            <div className="flex items-center flex-row mb-2 mt-4">
              <span className="label-text  w-1/3">Component name</span>
              <input type="text" onChange={e => setComponentName(e.target.value)} value={componentName} placeholder="Name" className="input input-bordered w-2/3 max-w-xs" />
            </div>

            <ReactQuill theme="snow" value={details} onChange={setDetails} />

            <span className="mt-2">Select section of this component</span>
            <CustomSelect name={"Sections"} options={sectionsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />

            <button onClick={(e) => handleEdit(e)} className="btn btn-wide top-2">Update Component</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
