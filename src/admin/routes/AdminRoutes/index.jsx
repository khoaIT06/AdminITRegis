import ArticlesPage from '~/admin/pages/ArticlesPage';
import SessionPage from '~/admin/pages/SessionPage';
import CategoryPage from '~/admin/pages/CategoryPage';
import AccountPage from '~/admin/pages/AccountPage';
import StudentPage from '~/admin/pages/StudentPage';
import LoginPage from '~/admin/pages/LoginPage';

const AdminRoutes = [
    { path: '/admin/articles', component: ArticlesPage },
    { path: '/admin/session', component: SessionPage },
    { path: '/admin/category', component: CategoryPage },
    { path: '/admin/accounts', component: AccountPage },
    { path: '/admin/student', component: StudentPage },
    { path: '/admin/login', component: LoginPage },
];

export default AdminRoutes;