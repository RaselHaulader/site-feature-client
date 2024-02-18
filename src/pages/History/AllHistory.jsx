import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react'
import { FeatureContext } from '../../providers/featuresProvider';

export default function AllHistory() {
  const [loading, setLoading] = useState(true);
  const [allHistory, setAllHistory] = useState(true);
  const [users, setUsers] = useState([]);
  const [paginationPages, setPaginationPages] = useState([]);
  const [currentPaginatedPage, setCurrentPaginatedPage] = useState(1);
  const [historyCount, setHistoryCount] = useState(0);
  const [spentTime, setSpentTime] = useState(0);
  const selectedUser = useRef(null);
  const selectedSection = useRef(null);
  const selectedTime = useRef(null);
  const { currentSite, sectionsOption } = useContext(FeatureContext);

  const setPagination = (currentPage, totalItems) => {
    const itemsPerPage = 5;
    const maxPaginationLinks = 3;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let startPage = Math.max(1, currentPage - Math.floor(maxPaginationLinks / 2));
    let endPage = Math.min(totalPages, startPage + maxPaginationLinks - 1);

    if (endPage - startPage + 1 < maxPaginationLinks) {
      startPage = Math.max(1, endPage - maxPaginationLinks + 1);
    }
    const paginationArray = [];
    for (let page = startPage; page <= endPage; page++) {
      paginationArray.push(page);
    }
    if ((1 < currentPage - 1 || currentPage === 3) && totalPages > 3) {
      paginationArray.unshift(1)
    }
    if (totalPages > paginationArray[paginationArray.length - 1]) {
      paginationArray.push(totalPages)
    }
    setPaginationPages(paginationArray);
  }

  const getHistoryData = (filterData) => {
    setLoading(true);
    setSpentTime('');
    axios.post(`http://localhost:5000/getAllHistory`, { ...filterData, site: currentSite })
      .then((res) => {
        const data = res.data.result;
        let count = res.data.count;
        console.log({ spentTime: res.data.spentTime })
        res.data.spentTime && setSpentTime(res.data.spentTime);
        data.length === 0 && (count = 0)
        setHistoryCount(count);
        console.log(data.length)
        setAllHistory(data);
        setPagination(filterData?.page ? filterData?.page : 1, count);
        filterData?.page && setCurrentPaginatedPage(filterData.page)
        setLoading(false);
      })
  }

  useEffect(() => {
    setLoading(true);
    console.log('all history')
    getHistoryData();
    axios(`http://localhost:5000/getAllUser`)
      .then((res) => {
        const data = res.data;
        setUsers(data)
      })
  }, [])

  const handleFilter = (changedToPage) => {
    const filterData = {};
    selectedUser.current.value && (filterData.userEmail = selectedUser.current.value);
    selectedSection.current.value && (filterData.sectionKey = selectedSection.current.value);
    selectedTime.current.value && (filterData.time = selectedTime.current.value);
    filterData.page = changedToPage ? changedToPage : 1;
    console.log(filterData)
    getHistoryData(filterData)
  }

  const handlePageChange = (changedTo) => {
    console.log({ changedTo })
    console.log(paginationPages.length)
    console.log({ changedTo })
    handleFilter(changedTo);
  }
  return (
    <div className='px-4'>
      <div>
        <h2 className='text-center p-1 lg:p-2 text-l uppercase bg-indigo-900'>Total history ({historyCount})</h2>
        <div className="flex items-center justify-end flex-row mb-2">
          <div className='mr-2'>
            <span className="label-text mb-2 inline-block">User</span>
            <select onChange={() => handleFilter()} ref={selectedUser} className="select select-bordered w-full max-w-xs">
              <option value={''}>All</option>
              {
                users.map((user, i) => <option value={user.email} key={i} >{user.name}</option>)
              }
            </select>
          </div>
          <div className='mr-2'>
            <span className="label-text mb-2 inline-block">Section</span>
            <select onChange={() => handleFilter()} ref={selectedSection} className="select select-bordered w-full max-w-xs">
              <option value={''}>All</option>
              {
                sectionsOption.map((section, i) => <option value={section.value} key={i} >{section.label}</option>)
              }
            </select>
          </div>
          <div className='mr-2'>
            <span className="label-text mb-2 inline-block">Time</span>
            <select onChange={() => handleFilter()} ref={selectedTime} className="select select-bordered w-full max-w-xs">
              <option value={''}>All</option>
              {
                ['Today', 'Last 5 days', 'Last 30 days'].map((time, i) => <option value={time} key={i} >{time}</option>)
              }
            </select>
          </div>
        </div>
        <div className="divider"></div>
        {
          (spentTime && allHistory.length >= 1) && <p className='text-right px-4 my-3'>Total spent time: {spentTime}</p>
        }
        {
          loading ? <div className='text-center mt-8'><span className="loading loading-spinner loading-md"></span></div> : allHistory.length >= 1 ?
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
                    <div className="divider divider-secondary mt-3 mb-2"></div>
                    <p><b>Comment:</b> {history.comment}</p>
                  </>
                  }

                </div>
              </>
            }) : <p className='text-center my-4'> No Data Found</p>
        }
        {paginationPages.length > 1 && <div className="join block text-center mt-4">
          {
            paginationPages.map(page => {
              return <button onClick={() => handlePageChange(page)} className={`join-item ${currentPaginatedPage === page ? 'active' : ''}  btn`}>{page}</button>
            })
          }
        </div>}
      </div>
    </div>
  )
}
