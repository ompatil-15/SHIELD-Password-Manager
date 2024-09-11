import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import Auth from './features/auth/Auth';
import NotFoundPage from './pages/notFoundPage';
import Notes from './features/notes/Notes';
import Passwords from './features/passwords/Passwords';
import Note from './features/notes/selectedNote';
import SelectedPassword from './features/passwords/selectedPassword';
import PersonalInformation from './features/personalInfo/PersonalInformation';
import PersistLogin from './features/auth/persistLogin';
import Prefetch from './features/auth/prefetch';
import Layout from './components/layout';

function App() {
  return (
    <Router>
      <Routes>  
        <Route path="/auth" element={<Auth />} />
        <Route index element={<HomePage />} />

        <Route path="/" element={<Layout />} >

          <Route element={<PersistLogin />}>
            <Route element={<Prefetch />}>

              <Route element={null}>
                <Route path="/personal-information" element={<PersonalInformation />} />
                <Route path="/passwords/:id" element={<SelectedPassword />}/>
                <Route path="/passwords" element={<Passwords />} />
                <Route path="/notes/:id" element={<Note />} />
                <Route path="/notes" element={<Notes />} />
              </Route>

            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
