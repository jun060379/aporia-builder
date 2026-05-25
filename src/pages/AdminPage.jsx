import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import PlaceholderPage from './PlaceholderPage.jsx';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <PlaceholderPage title="관리자 페이지" body="권한 확인 중입니다…" />;
  }

  if (!user) {
    return (
      <PlaceholderPage
        title="관리자 페이지"
        body="이 페이지는 로그인 후에 이용할 수 있습니다."
        extra={
          <Link
            to="/login"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
          >
            로그인하기
          </Link>
        }
      />
    );
  }

  if (!isAdmin) {
    return (
      <PlaceholderPage
        title="관리자 페이지"
        body="관리자 권한이 필요합니다."
      />
    );
  }

  return (
    <PlaceholderPage
      title="관리자 페이지"
      body="다음 단계에서 캐릭터 데이터, 에너미, 에너미 스킬 신청 검수 기능이 이곳에 추가됩니다."
    />
  );
}
