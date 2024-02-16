import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home/Home';
import { FeatureContext } from './providers/featuresProvider';
import { useContext } from 'react';
import Landing from './pages/Home/Landing';
import AllSection from './pages/Sections/AllSection';
import SingleComponent from './pages/Components/SingleComponent';
import AllHistory from './pages/History/AllHistory';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PrivateRoute from './routes/PrivateRoute';
import SingleSection from './pages/Sections/SingleSection';
import WaitUntilApproved from './pages/WaitUntilApproved/WaitUntilApproved';
import { AuthContext } from './providers/AuthProvider';
import Admin from './pages/Admin/Admin';

function App() {
  const { sites, pages, sectionsOption, componentsOption } = useContext(FeatureContext);
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path={`/login`} element={<Login />} />
        <Route path={`/not-approved`} element={<WaitUntilApproved />} />
        <Route path={`/`} element={<Landing sites={sites} />} />
        {
          sites?.map((site, idx) => {
            return <Route
              key={idx}
              path={`/${site.name.replaceAll(' ', '-')}`}
              element={
                  <PrivateRoute>
                    <Home sites={sites} site={site} pages={pages} />
                  </PrivateRoute>
                }
              >
                {
                  user?.role === 'admin' && <Route path={`/${site.name.replaceAll(' ', '-')}/admin`} element={<Admin />} />
                }
                {
                  pages.map((page, idx) => {
                    return <Route key={idx} path={`/${site.name.replaceAll(' ', '-')}/page/${site.name.replaceAll(' ', '-') + page.key}`} element={<AllSection />} />
                  })
                }
                {
                  sectionsOption.map(section => {
                    return <Route site={site} path={`/${site.name.replaceAll(' ', '-')}/section/${site.name.replaceAll(' ', '-')+ section.value}`} element={<SingleSection />} />
                  })
                }
                {
                  componentsOption.map(component => {
                    return <Route site={site} path={`/${site.name.replaceAll(' ', '-')}/component/${site.name.replaceAll(' ', '-')+ component.value}`} element={<SingleComponent />} />
                  })
                }
                <Route path={`/${site.name.replaceAll(' ', '-')}/history`} element={<AllHistory />} />
              </Route>
          })
        }
        <Route path={"*"} element={<Landing sites={sites} />} />
      </Routes>
    </Router >
  )
}

export default App
