import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hub from './pages/Hub.jsx';
import Builder from './Builder.jsx';
import EnemyPage from './pages/EnemyPage.jsx';
import MyPage from './pages/MyPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/enemy" element={<EnemyPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Hub />} />
      </Routes>
    </BrowserRouter>
  );
}
