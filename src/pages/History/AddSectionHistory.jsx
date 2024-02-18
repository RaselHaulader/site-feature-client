import axios from 'axios';
import React, { useRef, useState } from 'react'

export default function AddSectionHistory({ section, user, pageName }) {
  const modal = useRef(null);
  const comment = useRef(null);
  const days = useRef(null);
  const hour = useRef(null);
  const min = useRef(null);
  const [confirm, setConfirm] = useState(false);

  const openModal = () => {
    comment.current.value = '';
    days.current.value = 0;
    hour.current.value = 0;
    min.current.value = 0;
    modal.current.showModal();
  }

  const handleConfirm = () => {
    const current = confirm;
    setConfirm(current ? false : true);
  }

  const handleTested = () => {
    const timeLog = {
      days: days.current.value,
      hour: hour.current.value,
      min: min.current.value
    }
    const history = {
      site: window.location.pathname.split('/')[1],
      userEmail: user.userEmail,
      userName: user.userName,
      sectionKey: section.key,
      sectionName: section.name,
      pageName: pageName,
      timeLog: timeLog,
      date: new Date(),
      comment: comment.current.value
    }
    axios.post('http://localhost:5000/addHistory', history)
      .then(res => {
        if (res.data.acknowledged) {
          setConfirm(false)
          modal.current.close();
        }
      })
  }

  return (
    <div className='inline-block'>
      <button className='px-2 py-1 min-h-7 btn-outline btn btn-accent' onClick={() => openModal()}>Add Test Report</button>
      <dialog id="my_modal_3" ref={modal} className="modal">
        <div className="modal-box text-center">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div>
            <h2 className='text-l p-3 uppercase bg-indigo-950'>Add Time log and comments</h2>
            <div className="divider mb-1"></div>
            <p className='text-center'>{section.name}</p>
            <div className="divider mt-1"></div>
            <div className="flex items-center justify-center flex-row mb-2">
              <div className='mr-2'>
                <span className="label-text mb-2 inline-block">Day</span>
                <select ref={days} className="select select-bordered w-full max-w-xs">
                  {
                    [...Array(11)].map((e, i) => <option value={i} key={i} >{i}</option>)
                  }
                </select>
              </div>
              <div className='mr-2'>
                <span className="label-text mb-2 inline-block">Hour</span>
                <select ref={hour} className="select select-bordered w-full max-w-xs">
                  {
                    [...Array(8)].map((e, i) => <option value={i} key={i} >{i}</option>)
                  }
                </select>
              </div>
              <div className='mr-2'>
                <span className="label-text mb-2 inline-block">Minute</span>
                <select ref={min} className="select select-bordered w-full max-w-xs">
                  {
                    [...Array(60)].map((e, i) => <option value={i} key={i} >{i}</option>)
                  }
                </select>
              </div>
            </div><br />
            <span className="label-text w-4/5 mb-2 inline-block">If you hav any comment add here.</span> <br />
            <textarea ref={comment} className="textarea textarea-bordered w-4/5" placeholder="Comment here"></textarea>
            <br /><br />
            {confirm ? <> <button className='btn w-4/5 btn-primary text-center' onClick={() => handleTested()}>Yes Tested</button>
              <button className='btn w-4/5 mt-3 btn-error text-center' onClick={() => handleConfirm()}>No Later</button>
            </> : <button className='btn w-4/5 btn-primary text-center' onClick={() => handleConfirm()}>Tested</button>}
          </div>
        </div>
      </dialog>
    </div>
  )
}
