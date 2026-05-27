import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Lesson } from './pages/Lesson';
import { Courses } from './pages/Courses';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="lesson/:id" element={<Lesson />} />
          {/* Placeholders for other routes */}
          <Route path="courses" element={<Courses />} />
          <Route path="achievements" element={<div className="p-8 text-2xl">Conquistas em Breve</div>} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
