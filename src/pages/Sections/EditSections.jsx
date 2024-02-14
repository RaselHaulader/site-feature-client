import React, { useContext, useEffect, useRef, useState } from 'react'
import { FeatureContext } from '../../providers/featuresProvider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomSelect from '../Shared/CustomSelect';
import axios from 'axios';

export default function EditSections({ section, setSection }) {
  const { sectionsOption, setSectionsOption, componentsOption } = useContext(FeatureContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const sectionEditModal = useRef(null);
  const [details, setDetails] = useState('');
  const [sectionName, setSectionName] = useState('');

  const openEditPageModal = () => {
    const defaultSelected = section.components?.map((component) => ({ value: parseFloat(component.key), label: component.name }));
    console.log(defaultSelected)
    setDetails(section.details)
    setDefaultOptions(defaultSelected);
    setSelectedOptions(section.components);
    sectionEditModal.current.showModal();
  }

  useEffect(() => {
    setSectionName(section.name);
    const defaultSelected = section.components?.map((component) => ({ value: parseFloat(component.key), label: component.name }));
    console.log(defaultSelected)
    setDefaultOptions(defaultSelected);
    setSelectedOptions(section.components);
  }, [section])

  const handleEdit = () => {
    const editedSectionData = {
      key: parseFloat(section.key),
      site: section.site,
      name: sectionName,
      details: details,
      pages: section.pages,
      components: selectedOptions
    }
    const currentComponents = section.components;
    const editedComponents = editedSectionData.components;
    console.log('edited')
    function findNotMatchedObjects(arr1, arr2) {
      return arr1.filter(obj1 => !arr2.some(obj2 => obj1.key === obj2.key && obj1.name === obj2.name));
    }
    const addedComponents = findNotMatchedObjects(editedComponents, currentComponents);
    console.log({addedComponents})
    let removedComponents = []
    if (editedComponents.length < 1) {
      removedComponents = currentComponents;
    } else if (editedComponents.length < currentComponents.length || editedComponents.length === currentComponents.length) {
      removedComponents = findNotMatchedObjects(currentComponents, editedComponents);
    }
    console.log({removedComponents})
    console.log({editedSectionData})
    axios.post('http://localhost:5000/editSection', {editedSectionData, addedComponents, removedComponents})
    .then(res => {
      console.log(res)
      if (res.data.acknowledged) {
        let sectionIdx; 
        sectionsOption.forEach((singleSection, idx) => {
          if (singleSection.value == section.key) {
            sectionIdx = idx;
          }
        })
        console.log(sectionsOption)
        const allSections = [...sectionsOption];
        allSections[sectionIdx] = {value: editedSectionData.key, label: editedSectionData.name}
        setSectionsOption(allSections);
        setSection(editedSectionData);
        console.log({sectionIdx})
        console.log(res.data)
        sectionEditModal.current.close();
      }
    })
  }
  return (
    <div>
      <button className="btn btn-outline btn-primary" onClick={() => openEditPageModal()}>Edit</button>
      <dialog id="my_modal_3" ref={sectionEditModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div>
            <div className="flex items-center flex-row mb-2 mt-4">
              <span className="label-text  w-1/3">Section name</span>
              <input type="text" onChange={e => setSectionName(e.target.value)} value={sectionName} placeholder="Name" className="input input-bordered w-2/3 max-w-xs" />
            </div>
            <ReactQuill theme="snow" value={details} onChange={setDetails} />
            <span className="mt-2">Select components of this sections</span>
            <CustomSelect name={"Components"} options={componentsOption} setSelectedOptions={setSelectedOptions} defaultSelectedOptions={defaultOptions} />
            <button onClick={(e) => handleEdit(e)} className="btn btn-wide top-2">Update Section</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
