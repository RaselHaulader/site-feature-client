import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import { FeatureContext } from '../../providers/featuresProvider';

export default function AllHistory() {
  const [loading, setLoading] = useState(true);
  const [allHistory, setAllHistory] = useState(true);
  const { currentSite } = useContext(FeatureContext);
  useEffect(() => {
    setLoading(true);
    console.log('all history')
    axios.post(`http://localhost:5000/getAllHistory`, { site: currentSite, filter: 'filter data' })
      .then((res) => {
        const data = res.data;
        setAllHistory(data);
        console.log(data)
        setLoading(false);
      })
  }, [])
  return (
    <div className='px-4'>
      {
        loading ? <div className='text-center mt-8'><span className="loading loading-spinner loading-md"></span></div> : <div>
          <h2 className='text-center p-1 lg:p-2 text-l uppercase bg-indigo-900'>All history</h2>
          <div className="flex items-center justify-end flex-row mb-2">
            <div className='mr-2'>
              <span className="label-text mb-2 inline-block">Day</span>
              <select className="select select-bordered w-full max-w-xs">
                {
                  [...Array(11)].map((e, i) => <option value={i} key={i} >{i}</option>)
                }
              </select>
            </div>
            <div className='mr-2'>
              <span className="label-text mb-2 inline-block">Hour</span>
              <select className="select select-bordered w-full max-w-xs">
                {
                  [...Array(8)].map((e, i) => <option value={i} key={i} >{i}</option>)
                }
              </select>
            </div>
            <div className='mr-2'>
              <span className="label-text mb-2 inline-block">Minute</span>
              <select className="select select-bordered w-full max-w-xs">
                {
                  [...Array(61)].map((e, i) => <option value={i} key={i} >{i}</option>)
                }
              </select>
            </div>
          </div>
          <div className="divider"></div>
          {
            allHistory.map((history) => {
              const date = new Date(history.date);
              return <>
                <div className='border bg-base-200 rounded-xl border-slate-700 p-4 mb-3'>
                  <div className='flex justify-between'>
                    <div>
                      <p className='mb-2'>Tested <b className='text-cyan-500'>{history.sectionName}</b> from <b className='text-green-500'>{history.pageName}</b> page. Tested by <b className='text-gray-300'>{history.userName}</b></p>
                    </div>
                    <div>
                      <p>{date.toLocaleString()}</p>
                      <p className='text-right'>({history.timeLog.days}d {history.timeLog.hour}h  {history.timeLog.min}m)</p>
                    </div>
                  </div>
                  {history.comment && <>
                    <div className="divider divider-secondary my-3"></div>
                    <p><b>Comment:</b> {history.comment}</p>
                  </>
                  }

                </div>
              </>
            })
          }
        </div>
      }
    </div>
  )
}
