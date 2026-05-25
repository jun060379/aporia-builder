import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import PlaceholderPage from './PlaceholderPage.jsx';

export default function MyPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PlaceholderPage title="내 신청 목록" body="로그인 상태 확인 중입니다…" />;
  }

  if (!user) {
    return (
      <PlaceholderPage
        title="내 신청 목록"
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

  return (
    <PlaceholderPage
      title="내 신청 목록"
      body="아직 신청 저장 기능은 연결되지 않았습니다. 다음 단계에서 캐릭터 데이터와 에너미 신청 목록이 이곳에 표시됩니다."
    />
  );
}
