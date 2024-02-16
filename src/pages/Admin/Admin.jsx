import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Admin() {
  const [users, setUsers] = useState([]);
  const updateRole = (user, role) => {
    console.log(user, role)
    axios.post('http://localhost:5000/updateRole', { user, role })
      .then(res => {
        if (res.data.acknowledged) {
          let userIdx;
          users.forEach((singleUser, idx) => {
            if (singleUser.email == user.key) {
              userIdx = idx;
            }
          })
          const allUsers = [...users];
          const updateUser = user;
          user['role'] = role;
          allUsers[userIdx] = updateUser;
          setUsers(allUsers);
        }
      })
  }
  useEffect(() => {
    axios(`http://localhost:5000/getAllUser`)
      .then((res) => {
        const data = res.data;
        setUsers(data)
        console.log(data)
      })
  }, [])
  return (
    <div className='px-4'>
      <h2 className='text-center p-1 lg:p-2 text-l uppercase bg-indigo-900'>All User</h2>
      {
        users.map(user => {
          return <>
            <div className='mt-4'>
              <div className='ps-4 flex justify-between'>
                <span>
                  <span>{user.name} - {user.email} {user.role && `(${user.role})`}</span>
                </span>
                <div>
                  <button 
                    onClick={() => updateRole(user, user.role === 'user' ? '' : 'user')} 
                    className={`btn btn-outline m-2 ${user.role === 'user' ? 'btn-error' : 'btn-success'} min-h-7`}
                  >
                    {user.role === 'user' ? 'Removed' : 'Approved'} as User
                  </button>
                  <button 
                    onClick={() => updateRole(user, user.role === 'admin' ? '' : 'admin')} 
                    className={`btn btn-outline m-2 ${user.role === 'admin' ? 'btn-error' : 'btn-success'} min-h-7`}
                  >
                    {user.role === 'admin' ? 'Removed' : 'Approved'} as Admin
                  </button>
                </div>
              </div>
            </div>
          </>
        })
      }
    </div>
  )
}
