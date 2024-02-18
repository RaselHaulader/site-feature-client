import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../providers/AuthProvider';
import axios from 'axios';

export default function SectionHistory({ section }) {
  const modal = useRef(null);
  const [loading, setLoading] = useState(true);
  const [allHistory, setAllHistory] = useState(true);

  const openModal = () => {
    modal.current.showModal();
    setLoading(true);
    axios(`http://localhost:5000/getHistory/${section.key}`)
      .then((res) => {
        const data = res.data;
        setAllHistory(data);
        setLoading(false);
      })
  }
  return (
    <div className='inline-block'>
      <button className='px-2 py-1 min-h-7 btn-outline btn btn-secondary' onClick={() => openModal()}>Test History</button>
      <dialog id="my_modal_3" ref={modal} className="modal">
        <div className="modal-box text-left">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className='section-history'>
            <h2 className='text-l p-3 uppercase bg-indigo-900 text-center'>All history of {section.name}</h2>
            <div className="divider"></div>
            {
              loading ? <div className='text-center mt-8'><span className="loading loading-spinner loading-md"></span></div> : <div>
                {
                  allHistory.map((history) => {
                    const date = new Date(history.date);
                    return <>
                      <div className='border bg-base-200 rounded-xl border-slate-700 p-4 mb-3'>
                        <p className='flex justify-between'><span>Tested by <b className='text-cyan-500'>{history.userName}</b></span> {date.toLocaleString()}</p>
                        <p className='text-right'>({history.timeLog.days}d {history.timeLog.hour}h  {history.timeLog.min}m)</p>
                        {history.comment && <>
                          <div className="divider divider-secondary my-2"></div>
                          <p>Comment: {history.comment}</p>
                        </>
                        }

                      </div>
                    </>
                  })
                }
              </div>
            }
          </div>
        </div>
      </dialog>
    </div>
  )
}
