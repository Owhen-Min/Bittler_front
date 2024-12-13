<template>
  <div class="container-fluid bg-dark py-5" v-if="profile">
    <div class="container">
      <!-- 프로필 섹션 -->
      <div class="row gx-4">
        <!-- 왼쪽 사이드바 -->
        <div class="col-lg-4 col-md-5">
          <!-- 프로필 카드 -->
          <div class="profile-card content-card mb-4">
            <div class="profile-image-wrapper mb-4">
              <img 
                :src="store.BASE_URL + profile.profile_picture" 
                :alt="profile.nickname"
                class="profile-image"
              >
            </div>
            <h3 class="gradient-text mb-3">{{ profile.nickname }}</h3>
            <div class="profile-info">
              <div class="info-item">
                <i class="bi bi-calendar3"></i>
                <span>가입일: {{ formatDate(profile.join_date) }}</span>
              </div>
              <div class="info-item">
                <i class="bi bi-coin"></i>
                <span>보유 토큰: {{ profile.token }}</span>
              </div>
            </div>
            <!-- 버튼 그룹 -->
            <div class="button-group mt-4">
              <button @click="$router.go(-1)" class="btn btn-warning">
                이전으로
              </button>
              <RouterLink 
                v-if="profile.id === store.user?.pk"
                :to="{ name: 'ProfileChange', params: { userid: user_pk } }"
                class="btn btn-primary"
              >
                정보 변경
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- 오른쪽 메인 컨텐츠 -->
        <div class="col-lg-8 col-md-7">
          <div class="content-card">
            <h3>AI게시판</h3>
            <div class="stats-grid">
              <!-- 통계 카드들 -->
              <div class="stat-card">
                <i class="bi bi-heart-fill"></i>
                <h4>받은 좋아요</h4>
                <p class="gradient-text">{{ profile.ending_like_count }}</p>
              </div>
              <div class="stat-card">
                <i class="bi bi-pencil-fill"></i>
                <h4>작성 게시글</h4>
                <p class="gradient-text">{{ profile.ending_count }}</p>
              </div>
            </div>
            <br>
            <div class="stats-grid">
              <!-- 최근 대체 결말 섹션 수정 -->
              <div class="stat-card recent-content">
                <i class="bi bi-book-fill"></i>
                <h4>최근 대체 결말</h4>
                <ul class="recent-list">
                  <li v-for="ending in profile.recent_endings" :key="ending.id">
                    <div class="recent-item">
                      <RouterLink 
                        :to="{ name: 'EndingListDetail', params: { endingid: ending.id }}"
                        class="recent-link"
                      >
                        <span class="text-truncate">{{ ending.prompt }}</span>
                      </RouterLink>
                      <span class="recent-date">{{ formatDate(ending.created_at) }}</span>
                    </div>
                  </li>              
                </ul>
              </div>
            </div>
            <br>
            <h3>커뮤니티</h3>
            <div class="stats-grid">
              <!-- 통계 카드들 -->
              <div class="stat-card">
                <i class="bi bi-heart-fill"></i>
                <h4>받은 좋아요</h4>
                <p class="gradient-text">{{ profile.article_like_count }}</p>
              </div>
              <div class="stat-card">
                <i class="bi bi-pencil-fill"></i>
                <h4>작성 게시글</h4>
                <p class="gradient-text">{{ profile.article_count }}</p>
              </div>
            </div>
            <br>
            <div class="stats-grid">
              <!-- 최근 게시글 섹션 수정 -->
              <div class="stat-card recent-content">
                <i class="bi bi-file-text-fill"></i>
                <h4>최근 게시글</h4>
                <ul class="recent-list">
                  <li v-for="article in profile.recent_articles" :key="article.id">
                    <div class="recent-item">
                      <RouterLink 
                        :to="{ name: 'CommunityDetail', params: { articleid: article.id }}"
                        class="recent-link"
                      >
                        <span class="text-truncate">{{ article.title }}</span>
                      </RouterLink>
                      <span class="recent-date">{{ formatDate(article.created_at) }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMovieStore } from '@/stores/movieStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute()
const user_pk = route.params.userid
const store = useMovieStore()
const profile = ref(null)

onMounted(() => {
  axios({
    method: 'get',
    url: `${store.API_URL}/accounts/info/${user_pk}/`
  })
    .then((response) => {
      profile.value = response.data
    })
    .catch((error) => {
      store.showModalMessage('프로필을 불러오는 데 실패했습니다.', error)
    })
})

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.content-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  color: white;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.profile-card {
  text-align: center;
}

.profile-image-wrapper {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(45deg, #ff6b6b, #ffb88c);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #1a1a1a;
}

.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #ffb88c);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.info-item i {
  color: #ffb88c;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-primary {
  background: linear-gradient(45deg, #ff6b6b, #ffb88c);
  border: none;
}

.btn-warning {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #ffb88c;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card i {
  font-size: 2rem;
  color: #ffb88c;
  margin-bottom: 1rem;
}

.stat-card h4 {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.stat-card p {
  font-size: 1.5rem;
  margin: 0;
}

@media (max-width: 768px) {
  .content-card {
    padding: 1.5rem;
  }
  
  .profile-image-wrapper {
    width: 120px;
    height: 120px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .recent-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .recent-link {
    width: 100%;
  }

  .recent-date {
    font-size: 0.8rem;
    margin-left: 0.2rem;
  }

  .text-truncate {
    max-width: 100%;
  }
}

.recent-content {
  text-align: left;
  width: 100%;
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.recent-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.recent-list li:last-child {
  border-bottom: none;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.recent-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  flex: 1;
  min-width: 0; /* 텍스트 오버플로우를 위해 필요 */
}

.text-truncate {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-date {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap; /* 날짜가 줄바꿈되지 않도록 설정 */
  flex-shrink: 0; /* 날짜 영역이 줄어들지 않도록 설정 */
}

.recent-link:hover {
  color: #ffb88c;
}

.container-fluid {
  margin-top: 100px;
}
</style>