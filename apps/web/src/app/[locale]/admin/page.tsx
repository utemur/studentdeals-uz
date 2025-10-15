import { Container } from '@studentdeals/ui';
import { requireAdmin } from '@/lib/auth-admin';
import { AdminUsersTable } from '@/components/admin/AdminUsersTable';

interface AdminPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    search?: string;
  };
}

export default async function AdminPage({ params, searchParams }: AdminPageProps) {
  // Require admin role (redirects if not admin)
  await requireAdmin(params.locale);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  // Fetch users from API
  let users = [];
  let stats = { totalUsers: 0, verifiedUsers: 0, adminUsers: 0, regularUsers: 0 };
  
  try {
    const searchQuery = searchParams.search ? `?search=${searchParams.search}` : '';
    const usersResponse = await fetch(`${API_URL}/admin/users${searchQuery}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (usersResponse.ok) {
      users = await usersResponse.json();
    }

    const statsResponse = await fetch(`${API_URL}/admin/stats`, {
      cache: 'no-store',
    });
    
    if (statsResponse.ok) {
      stats = await statsResponse.json();
    }
  } catch (error) {
    console.error('Failed to fetch admin data:', error);
  }

  return (
    <Container className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👑 Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users and view system statistics
          </p>
        </div>
        <a
          href={`/${params.locale}`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          ← {params.locale === 'ru' ? 'На сайт' : 'Saytga qaytish'}
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Users</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Verified Users</div>
          <div className="text-3xl font-bold text-green-600">{stats.verifiedUsers}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Admin Users</div>
          <div className="text-3xl font-bold text-blue-600">{stats.adminUsers}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Regular Users</div>
          <div className="text-3xl font-bold text-gray-600">{stats.regularUsers}</div>
        </div>
      </div>

      {/* Users Table */}
      <AdminUsersTable users={users} initialSearch={searchParams.search} />
    </Container>
  );
}

