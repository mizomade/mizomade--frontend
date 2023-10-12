import { RouteRecordRaw } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        name: 'PostDetail',
        path: '/detail/:slug',
        component: () => import('pages/PostDetail.vue'),
      },
      {
        name: 'CategoryPage',
        path: '/category/:category',
        component: () => import('pages/CategoriesPage.vue'),
      },
      {
        name: 'SearchPage',
        path: '/search/:q',
        component: () => import('pages/SearchPage.vue'),
      },
      {
        name: 'TagPage',
        path: '/tags/:tag',
        component: () => import('pages/TagsPage.vue'),
      },
      {
        name: 'RegisterPage',
        path: '/register',
        component: () => import('pages/User/RegisterPage.vue'),
      },
      {
        name: 'OtpPage',
        path: '/otp/:phone',
        component: () => import('pages/User/OtpPage.vue'),
      },
      {
        name: 'LoginPage',
        path: '/login',
        component: () => import('pages/User/LoginPage.vue'),
      },
      {
        name: 'UserPage',
        path: '/user/:user',
        component: () => import('pages/User/UserPage.vue'),
      },
      {
        name: 'Info',
        path: 'info',
        // component: () => import('layouts/MainLayout.vue'),

        children: [
          {
            name: 'Info',
            path: '',
            component: () => import('pages/Info/AboutPage.vue'),
          },
          {
            name: 'AboutPage',
            path: 'about',
            component: () => import('pages/Info/AboutPage.vue'),
          },
          {
            name: 'DisclaimerPage',
            path: 'disclaimer',
            component: () => import('pages/Info/DisclaimerPage.vue'),
          },
          {
            name: 'PrivacyPage',
            path: 'privacy',
            component: () => import('pages/Info/PrivacyPage.vue'),
          },
          {
            name: 'TermsPage',
            path: 'terms-and-condition',
            component: () => import('pages/Info/TermsPage.vue'),
          },
          {
            name: 'ContactUsPage',
            path: 'contact-us',
            component: () => import('pages/Info/ContactUsPage.vue'),
          },
        ],
      },
      {
        path: '/account/', // Parent route for authenticated routes
        // component: () => import('layouts/MainLayout.vue'),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore();
          // Apply authentication check at the parent route level
          if (userStore.isAuthenticated) {
            next(); // Allow access to child routes
          } else {
            next('/login'); // Redirect to the login page if not authenticated
          }
        },
        children: [
          {
            name: 'DraftPost',
            path: 'draft/:id',
            component: () => import('pages/Posts/CreatePost.vue'),
          },
          {
            name: 'CreatePost',
            path: 'create',
            component: () => import('pages/Posts/CreatePost.vue'),
          },
          {
            name: 'FinalizePost',
            path: 'final/:id',
            component: () => import('pages/Posts/FinalizePost.vue'),
          },
          {
            name: 'EditProfile',
            path: 'edit-profile',
            component: () => import('pages/User/EditProfile.vue'),
          },
          {
            name: 'Dashboard',
            path: 'dashboard',
            component: () => import('pages/User/Dashboard/DashboardPage.vue'),
          },
          {
            name: 'Settings',
            path: 'settings',
            component: () => import('layouts/MainLayout.vue'),

            children: [
              {
                name: 'SettingsPage',
                path: '',
                component: () => import('pages/User/Settings/SettingsPage.vue'),
              },
              {
                name: 'ChangePassword',
                path: 'change-password',
                component: () =>
                  import('pages/User/Settings/PasswordChangePage.vue'),
              },
              {
                name: 'ChangePhone',
                path: 'change-phone',
                component: () => import('pages/User/Settings/PhoneChange.vue'),
              },
              {
                name: 'OtpSettingsPage',
                path: 'otp-settings/:purpose',
                component: () =>
                  import('src/pages/User/Settings/OtpSettingsPage.vue'),
              },
            ],
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Info/ErrorNotFound.vue'),
  },
];

export default routes;
