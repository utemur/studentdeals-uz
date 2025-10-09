import { redirect } from 'next/navigation';
import { Container, Card, CardHeader, CardContent } from '@studentdeals/ui';
import { getCurrentUser } from '@/lib/auth-server';

export default async function DashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const user = await getCurrentUser();

  // Redirect to signin if not authenticated
  if (!user) {
    redirect(`/${params.locale}/signin`);
  }

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* User Info */}
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Информация о пользователе
                </h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Дата регистрации</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email подтверждён</dt>
                    <dd className="mt-1 text-sm">
                      {user.emailVerifiedAt ? (
                        <span className="text-green-600">✓ Подтверждён</span>
                      ) : (
                        <span className="text-yellow-600">⚠ Не подтверждён</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Stats */}
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Статистика
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Сохранённых предложений</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Использованных скидок</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">Отзывов</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Быстрые действия
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={`/${params.locale}`}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    🏠 На главную
                  </a>
                  <a
                    href={`/${params.locale}/health`}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    🏥 Health Check
                  </a>
                </div>
              </div>

              {/* Protected Content Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Защищённая страница
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Эта страница доступна только авторизованным пользователям.
                        Вы успешно прошли аутентификацию через httpOnly cookie.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

