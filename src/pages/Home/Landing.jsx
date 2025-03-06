import React, { useContext } from 'react'
import Navbar from '../Shared/Navbar/Navbar'
import { FeatureContext } from '../../providers/featuresProvider';
import { AuthContext } from '../../providers/AuthProvider';

export default function Landing() {
  const { sites } = useContext(FeatureContext);
  const { user } = useContext(AuthContext);
  return (<>
    <Navbar sites={sites}></Navbar>
    <h1 className='text-center my-8'>
      {
        !user ? 'Please Login First' : 'Please select a store'
      }
    </h1>
  </>
  )
}
