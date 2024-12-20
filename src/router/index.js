import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import ProfileView from '@/views/ProfileView.vue'
import MovieListView from '@/views/MovieListView.vue'
import EndingListView from '@/views/EndingListView.vue'
import EndingListDetailView from '@/views/EndingListDetailView.vue'
import EndingListCreateView from '@/views/EndingListCreateView.vue'
import CommunityView from '@/views/CommunityView.vue'
import CommunityDetailView from '@/views/CommunityDetailView.vue'
import CommunityCreateView from '@/views/CommunityCreateView.vue'
import MovieListSelectView from '@/views/MovieListSelectView.vue'
import AdminMovieCreateView from '@/views/AdminMovieCreateView.vue'
import AdminMovieSelectView from '@/views/AdminMovieSelectView.vue'
import CommunityUpdateView from '@/views/CommunityUpdateView.vue'
import ProfileChangeView from '@/views/ProfileChangeView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import InstructionView from '@/views/InstructionView.vue'
import { useMovieStore } from '@/stores/movieStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. 소개 페이지
    {
      path: '/',
      name: 'Welcome',
      component: WelcomeView,
    },
    // 2. 이용방법 페이지
    {
      path: '/instruction',
      name: 'Instruction',
      component: InstructionView,
    },
    // 3. 메인 페이지
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
    },
    // 4. 로그인 페이지
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    // 5. 회원가입 페이지
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUpView
    },
    // 6. 사용자 프로필 페이지
    {
      path: '/profile/:userid',
      name: 'Profile',
      component: ProfileView
    },
    // 7. 사용자 프로필 변경 페이지
    {
      path: '/profile/:userid/change',
      name: 'ProfileChange',
      component: ProfileChangeView
    },
    // 8. 원본 영화 리스트 페이지
    {
      path: '/movielist',
      name: 'MovieList',
      component: MovieListView
    },
    // 9. 원본 영화 선택 페이지
    {
      path: '/movieselect',
      name: 'MovieSelect',
      component: MovieListSelectView
    },
    // 10. 대체 결말 리스트 페이지
    {
      path: '/ending',
      name: 'EndingList',
      component: EndingListView
    },
    // 11. 대체 결말 상세 페이지
    {
      path: '/ending/:endingid',
      name: 'EndingListDetail',
      component: EndingListDetailView
    },
    // 12. 대체 결말 생성 페이지
    {
      path: '/ending/create/:movieid',
      name: 'EndingListCreate',
      component: EndingListCreateView
    },
    // 13. 커뮤니티 게시판 페이지
    {
      path: '/community',
      name: 'Community',
      component: CommunityView
    },
    // 14. 커뮤니티 게시글 상세 페이지
    {
      path: '/community/:articleid',
      name: 'CommunityDetail',
      component: CommunityDetailView
    },
    // 15. 커뮤니티 게시글 작성 페이지
    {
      path: '/community/create',
      name: 'CommunityCreate',
      component: CommunityCreateView
    },
    // 16. 커뮤니티 게시글 수정 페이지
    {
      path: '/community/:articleid/update',
      name: 'CommunityUpdate',
      component: CommunityUpdateView
    },

    // 17. 관리자용 영화 등록 페이지
    {
      path: '/admin/movies/create',
      name: 'AdminMovieCreate',
      component: AdminMovieCreateView,
      beforeEnter: (to, from, next) => {
        const store = useMovieStore()
        if (!store.user.is_admin) {
          next({ name: 'Home' })
          store.showModalMessage('접근 제한', '관리자만 접근 가능한 페이지입니다.')
        } else {
          next()
        }
      }
    },
    // 18. 관리자용 영화 선택 페이지
    {
      path: '/admin/movies',
      name: 'AdminMovieSelect',
      component: AdminMovieSelectView,
      beforeEnter: (to, from, next) => {
        const store = useMovieStore()
        if (!store.user.is_admin) {
          next({ name: 'Home' })
          store.showModalMessage('접근 제한', '관리자만 접근 가능한 페이지입니다.')
        } else {
          next()
        }
      }
    },
  ],
})

router.beforeEach ((to, from) => {
  const store = useMovieStore()
  if (to.name === 'Welcome' && store.isLogin) return { name : 'Home'}
  if ((to.name==='CommunityCreate'|to.name==='EndingListCreate'|to.name==='EndingListDetail'|to.name==='MovieSelect'|to.name==='Profile') && !store.isLogin) {
    store.showModalMessage('Error', '로그인이 필요합니다')
    return { name : 'Login'}
  }
  else if ((to.name === 'SignUp'|to.name==='Login') && store.isLogin){
    store.showModalMessage('Error', '이미 로그인 되어 있습니다.')
    return { name : 'Home'}
  }
})

export default router
