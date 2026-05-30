import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import Hub from './pages/Hub.jsx';
import Builder from './Builder.jsx';
import EnemyPage from './pages/EnemyPage.jsx';
import MyPage from './pages/MyPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import CharactersPage from './pages/CharactersPage.jsx';
import ItemMakerPage from './pages/ItemMakerPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/items" element={<ItemMakerPage />} />
          <Route path="/enemy" element={<EnemyPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Hub />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
