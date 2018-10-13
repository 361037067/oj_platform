import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: resolve => require(['../components/page/Dashboard.vue'], resolve),
          meta: { title: 'DashBoard' }
        },
        {
          path: '/personal',
          component: resolve => require(['../components/page/Personal.vue'], resolve),
          meta: { title: 'Settings' }
        },
        {
          path: '/module',
          component: resolve => require(['../components/page/Module.vue'], resolve),
          meta: { title: 'Overview' }
          // children: [
          //   {
          //     path: '/editModule',
          //     component: resolve => require(['../components/module/editModule.vue'], resolve)
          //   // meta: { title: '课程总览' },
          //   }
          // ]
        },
        {
          path: '/users',
          component: resolve => require(['../components/page/Users.vue'], resolve),
          meta: { title: 'Users', permission: true }
        },
        {
          path: '/appointList',
          component: resolve => require(['../components/page/AppointList.vue'], resolve),
          meta: { title: 'AppointList', permission: true }
        },
        // {
        //   path: '/table',
        //   component: resolve => require(['../components/page/BaseTable.vue'], resolve),
        //   meta: { title: '基础表格' }
        // },
        {
          path: '/messages',
          component: resolve => require(['../components/page/Messages.vue'], resolve),
          meta: { title: 'Messages' }
        },
        {
          path: '/tabs',
          component: resolve => require(['../components/page/Tabs.vue'], resolve),
          meta: { title: 'Messages' }
        },
        {
          path: '/form',
          component: resolve => require(['../components/page/BaseForm.vue'], resolve),
          meta: { title: '基本表单' }
        },
        {
          // 富文本编辑器组件
          path: '/editor',
          component: resolve => require(['../components/page/VueEditor.vue'], resolve),
          meta: { title: '富文本编辑器' }
        },
        {
          // markdown组件
          path: '/markdown',
          component: resolve => require(['../components/page/Markdown.vue'], resolve),
          meta: { title: 'markdown编辑器' }
        },
        {
          // 图片上传组件
          path: '/upload',
          component: resolve => require(['../components/page/Upload.vue'], resolve),
          meta: { title: '文件上传' }
        },
        // {
        //   // vue-schart组件
        //   path: '/charts',
        //   component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
        //   meta: { title: 'schart图表' }
        // },
        {
          // vue-schart组件
          path: '/charts',
          component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
          meta: { title: '成绩分析' }
        },
        {
          // 拖拽列表组件
          path: '/drag',
          component: resolve => require(['../components/page/DragList.vue'], resolve),
          meta: { title: '拖拽列表' }
        },
        {
          // 权限页面
          path: '/permission',
          component: resolve => require(['../components/page/Permission.vue'], resolve),
          meta: { title: '权限测试', permission: true }
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve),
      meta: { allowBack: false }
    },
    // {
    //   path: '/signUpByMail',
    //   component: resolve => require(['../components/signUp/byMail.vue'], resolve),
    //   meta: { allowBack: false }
    // },
    // {
    //   path: '/signUpbyAccount',
    //   component: resolve => require(['../components/signUp/byAccount.vue'], resolve),
    //   meta: { allowBack: false }
    // },
    {
      path: '/signUpByIdentity',
      component: resolve => require(['../components/signUp/byIdentity.vue'], resolve),
      meta: { allowBack: false }
    },
    {
      path: '/examine',
      component: resolve => require(['../components/page/Examine.vue'], resolve),
      meta: { allowBack: false }
    },
    {
      path: '/404',
      component: resolve => require(['../components/page/404.vue'], resolve)
    },
    {
      path: '/403',
      component: resolve => require(['../components/page/403.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
