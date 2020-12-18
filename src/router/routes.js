
// const routes = [
//   {
//     path: '/',
//     component: () => import('layouts/MyLayout.vue'),
//     children: [
//       { path: '', component: () => import('pages/Index.vue') }
//     ]
//   }
// ]
var Versi = 'Versi2'; // By Wilianto 2019 09 05

const routes = [
  { 
    path: '/', component: () => import('layouts/' + Versi + '/MainMenu'), 
    children: [
        { path: '/', name : 'mainMenu', component: () => import('pages/HomePage') },
        { path: '/subError401', name : 'subError401', component: () => import('pages/Error401') },
        // { path: '/homePage', name : 'homePage', component: () => import('pages/HomePage') },
        // { path: '*', component: () => import('pages/404')  }
    ]
  },
  { 
    path: '/login', name : 'login', component: () => import('layouts/' + Versi + '/login') 
  },
  { 
    path: '/report', name : 'report', component: () => import('layouts/' + Versi + '/report') 
  },
  { 
    path: '/error401', name : 'error401', component: () => import('pages/Error401') 
  }, // Always leave this as last one
  { 
    path: '*', component: () => import('pages/Error505') 
  }, // Always leave this as last one
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
