import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements, } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UserProvider from './context/UserContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ContentProvider } from './context/EditorContent.jsx';
import PublicRoutes from './components/PublicRoutes.jsx';
const Home = lazy(() => import('./pages/Home.jsx'))
const Login = lazy(() => import('./pages/LoginPage.jsx'))
const Signup = lazy(() => import('./pages/SignupPage.jsx'))
const EditorPage = lazy(() => import('./pages/EditorPage.jsx'))
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Categories = lazy(() => import('./pages/ExploreBlogs.jsx'))
const SideNavbar = lazy(() => import('./components/SideNavbar.jsx'))
const ChangePassword = lazy(() => import('./components/ChangePassword.jsx'))
const EditProfile = lazy(() => import('./components/EditProfile.jsx'))
const ManageBlogs = lazy(() => import('./components/ManageBlogs.jsx'))
const Tags = lazy(() => import('./pages/Tags.jsx'))
const ErrorPage = lazy(() => import('./components/ErrorPage.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'))



export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 60 * 1000,
      retry: 3
    },
  },
});

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<App />}>
        <Route index element={<Home />} />
        <Route path='blog/:slug' element={<BlogPage />} />
        <Route path='profile/:id' element={<Profile />} />
        <Route path='explore' element={<Categories />} />
        <Route path='/tag/:tag' element={<Tags />} />
        <Route element={<PublicRoutes />}>
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='reset-password' element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path='editor' element={<EditorPage />} />
          <Route path='editor/:id' element={<EditorPage />} />
          <Route path='settings' element={<SideNavbar />}>
            <Route path='edit-profile' element={<EditProfile />} />
            <Route path='change-password' element={<ChangePassword />} />
          </Route>
          <Route path='dashboard' element={<SideNavbar />}>
            <Route path='blogs' element={<ManageBlogs />} />
          </Route>
        </Route>
        <Route path='*' element={<ErrorPage />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <ContentProvider>
        <RouterProvider router={routes} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ContentProvider>
    </UserProvider>
  </QueryClientProvider>
)
