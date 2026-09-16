import { createRouter, createWebHistory } from 'vue-router'
import EditPostView from '../views/EditPostView.vue'
import HomeView from '../views/HomeView.vue'
import PostsView from '../views/PostsView.vue'
import AddPostView from '../views/AddPostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
  {
    path: '/posts/edit/:id',
    name: 'edit-post',
    component: EditPostView
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostsView
  },
  {
    path: '/posts/add',
    name: 'add-post',
    component: AddPostView
  }
]
})

export default router
