import React, { useEffect, useRef, useState } from 'react'

export default function CustomSelect({ name, options, setSelectedOptions, defaultSelectedOptions }) {
  const customSelectModal = useRef(null);
  const [checkItem, setCheckItem] = useState([]);
  useEffect(() => {
    console.log('defaultSelectedOptions', options )
    console.log('defaultSelectedOptions', defaultSelectedOptions )
    setCheckItem(defaultSelectedOptions?.map(({value}) => value))
    console.log(defaultSelectedOptions?.map(({value}) => value))
  },[defaultSelectedOptions]);
  
  const openCustomSelectModal = () => {
    customSelectModal.current.showModal();
  }

  const handleCheckBoxToggle = (key) => {
    const currentCheckItem = checkItem ? [...checkItem] : [];
    const indexToRemove = currentCheckItem.indexOf(key);
    if (indexToRemove !== -1) {
      currentCheckItem.splice(indexToRemove, 1);
    } else {
      currentCheckItem.push(parseFloat(key));
    }
    setCheckItem(currentCheckItem)
  }
  const handleSelection = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = [];
    formData.forEach((value, key) => {
      values.push({key: parseFloat(key), name: options.find(option => option.value == key).label});
    });
    console.log({values})
    setSelectedOptions(values)
    customSelectModal.current.close();
  }
  return (
    <div className="mt-4 mb-4">
      <button className="btn btn-outline btn-info w-full" onClick={() => openCustomSelectModal()}>Select {name}</button>
      <dialog id={`select-modal-${name}`} ref={customSelectModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className="mt-4">
            <form onSubmit={handleSelection}>
              {options?.map((option, i) => {
                console.log(checkItem?.includes(parseFloat(option.value)))
                return <div key={i} className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text">{option.label}</span>
                    <input checked={checkItem?.includes(parseFloat(option.value))} onChange={() => handleCheckBoxToggle(parseFloat(option.value))} type="checkbox" name={option.value} className="checkbox checkbox-info" />
                  </label>
                  <div className="divider"></div>
                </div>
              })}
              <button type="submit" className="btn btn-outline btn-info w-full top-2">Select</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}
