<template>
  <q-page class="q-my-md column justify-center items-center indexContainer">
    <div class="flex q-gutter-md justify-center">
      <div
        v-if="loading"
        class="q-gutter-md flex row flex-wrap justify-center"
        :class="$q.screen.width >= 100 ? 'col-12' : 'col-3'"
      >
        <div v-for="index in 6" :key="index">
          <SkeletonPostCard />
        </div>
      </div>
      <div
        v-else
        :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
        v-for="post in posts"
        :key="post"
        class="q-gutter-md"
      >
        <post-card
          :cover-image="post.coverimage"
          :title="post.title"
          :author="post.author"
          :authorimage="post.authorphoto"
          :post-date="post.date"
          :slug="post.slug"
        ></post-card>
      </div>

      <!-- Pagination -->

      <!-- {{ pagination }} -->
    </div>
    <q-pagination
      class="q-py-md self-center"
      v-if="pagination.next || pagination.previous"
      v-model="currentPage"
      :totalPages="totalPages"
      @update:model-value="loadPage"
      :max="4"
      direction-links
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from 'src/boot/axios';
import PostCard from 'components/PostCard.vue';
import SkeletonPostCard from 'components/SkeletonPostCard.vue';
import router from 'src/router';
import { route } from 'quasar/wrappers';

const posts = ref([]); // Store the list of posts
const pagination = ref({}); // Store pagination data
const currentPage = ref(1); // Current page
const loading = ref(true);
const totalPages = computed(() => {
  return Math.ceil(pagination.value.count / 12); // Assuming 10 posts per page
});

const loadPage = (page) => {
  // Make an API request to fetch posts for the given page
  api
    .get(`/posts/?page=${page}`)

    .then((res) => {
      posts.value = res.data.results; // Update the posts list
      pagination.value = {
        next: res.data.next,
        previous: res.data.previous,
        count: res.data.count,
      };
      loading.value = false;
    })
    .catch((error) => {
      console.error('Error loading posts:', error);
    });
};

onMounted(() => {
  loadPage(currentPage.value);
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
