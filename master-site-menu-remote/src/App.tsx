
import { useEffect } from 'react'
import ExposedSite from './components/ExposedSite'
import { restAPI, ApiDataResponse,getUserClient } from 'globalUtils/utils'
import Cookies from 'js-cookie'
import { Toaster } from 'globalUtils/components';
function App() {


  return (
    <div>
      <ExposedSite/>
      <Toaster />
    </div>
  )
}

export default App
