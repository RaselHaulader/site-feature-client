import React, { useContext, useEffect, useRef, useState } from 'react'
import { FeatureContext } from '../../providers/featuresProvider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomSelect from '../Shared/CustomSelect';
import axios from 'axios';

export default function EditSections({ section, setSection }) {
  const { pagesOption, sectionsOption, setSectionsOption, componentsOption } = useContext(FeatureContext);
  const [selectedPageOptions, setSelectedPageOptions] = useState([]);
  const [selectedComponentOptions, setSelectedComponentOptions] = useState([]);
  const [defaultPageOptions, setDefaultPageOptions] = useState([]);
  const [defaultComponentOptions, setDefaultComponentOptions] = useState([]);
  const sectionEditModal = useRef(null);
  const [details, setDetails] = useState('');
  const [sectionName, setSectionName] = useState('');

  const openEditSectionModal = () => {
    const defaultComponentSelected = section.components?.map((component) => ({ value: parseFloat(component.key), label: component.name }));
    const defaultPagesSelected = section.pages?.map((page) => ({ value: parseFloat(page.key), label: page.name }));
    console.log(defaultComponentSelected)
    setDetails(section.details)
    setDefaultComponentOptions(defaultComponentSelected);
    setDefaultPageOptions(defaultPagesSelected);
    setSelectedComponentOptions(section.components);
    setSelectedPageOptions(section.pages);
    sectionEditModal.current.showModal();
  }

  useEffect(() => {
    setSectionName(section.name);
    const defaultComponentSelected = section.components?.map((component) => ({ value: parseFloat(component.key), label: component.name }));
    const defaultPagesSelected = section.pages?.map((page) => ({ value: parseFloat(page.key), label: page.name }));
    console.log(defaultComponentSelected)
    setDefaultPageOptions(defaultPagesSelected);
    setDefaultComponentOptions(defaultComponentSelected);
    setSelectedComponentOptions(section.components);
    setSelectedPageOptions(section.pages);
  }, [section])

  const handleEdit = () => {
    const editedSectionData = {
      key: parseFloat(section.key),
      site: section.site,
      name: sectionName,
      details: details,
      pages: selectedPageOptions,
      components: selectedComponentOptions
    }
    function findNotMatchedObjects(arr1, arr2) {
      return arr1.filter(obj1 => !arr2.some(obj2 => obj1.key === obj2.key && obj1.name === obj2.name));
    }
    const currentPages = section.pages;
    const editedPages = editedSectionData.pages;
    const currentComponents = section.components;
    const editedComponents = editedSectionData.components;
    const addedPages = findNotMatchedObjects(editedPages, currentPages);
    const addedComponents = findNotMatchedObjects(editedComponents, currentComponents);
    console.log({ addedComponents });
    let removedPages = [];
    let removedComponents = [];
    if (editedPages.length < 1) {
      removedPages = currentPages;
    } else if (editedPages.length < currentPages.length || editedPages.length === currentPages.length) {
      removedPages = findNotMatchedObjects(currentPages, editedPages);
    }
    if (editedComponents.length < 1) {
      removedComponents = currentComponents;
    } else if (editedComponents.length < currentComponents.length || editedComponents.length === currentComponents.length) {
      removedComponents = findNotMatchedObjects(currentComponents, editedComponents);
    }
    console.log({ editedSectionData })
    console.log({ removedPages })
    console.log({ removedComponents })
    axios.post('http://localhost:5000/editSection', { editedSectionData, addedPages, removedPages, addedComponents, removedComponents })
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
          allSections[sectionIdx] = { value: editedSectionData.key, label: editedSectionData.name }
          setSectionsOption(allSections);
          setSection(editedSectionData);
          console.log({ sectionIdx })
          console.log(res.data)
          sectionEditModal.current.close();
        }
      })
  }
  return (
    <div>
      <button className="btn btn-outline btn-info mr-4" onClick={() => openEditSectionModal()}>Edit Section</button>
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

            <span className="mt-2">Select pages of this sections</span>
            <CustomSelect name={"Pages"} options={pagesOption} setSelectedOptions={setSelectedPageOptions} defaultSelectedOptions={defaultPageOptions} />

            <span className="mt-2">Select components of this sections</span>
            <CustomSelect name={"Components"} options={componentsOption} setSelectedOptions={setSelectedComponentOptions} defaultSelectedOptions={defaultComponentOptions} />

            <button onClick={(e) => handleEdit(e)} className="btn btn-wide top-2">Update Section</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
