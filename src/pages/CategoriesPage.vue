<template>
  <q-page class="q-px-xl q-py-md column justify-center indexContainer">
    <div>
      <h4 class="text-center">
        Category :<b>{{ category }} </b>
      </h4>
    </div>

    <div class="q-gutter-md flex justify-center">
      <div
        v-if="loading"
        class="row q-gutter-md"
        :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
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
      <q-pagination
        class="q-py-md q-mx-auto"
        v-if="pagination.next || pagination.previous"
        v-model="currentPage"
        :totalPages="totalPages"
        @update:model-value="loadPage"
        :max="4"
        direction-links
      />
      <!-- Pagination -->

      <!-- {{ pagination }} -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { api } from 'src/boot/axios';
import PostCard from 'components/PostCard.vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import SkeletonPostCard from 'components/SkeletonPostCard.vue';

const route = useRoute();
const $q = useQuasar();
const loading = ref(true);
const posts = ref([]); // Store the list of posts
const pagination = ref({}); // Store pagination data
const currentPage = ref(1); // Current page
const category = ref(route.params.category);
const totalPages = computed(() => {
  return Math.ceil(pagination.value.count / 12); // Assuming 10 posts per page
});

const loadPage = (page) => {
  // Make an API request to fetch posts for the given page and category
  api
    .get(`/categoryposts/${category.value}?page=${page}`)
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
  // Initial load based on the category in the route
  category.value = route.params.category;
  loadPage(currentPage.value);
});

// Watch for changes in the category route parameter and reload data
watch(
  () => route.params.category,
  (newCategory) => {
    category.value = newCategory;
    loadPage(currentPage.value);
  }
);
</script>

<style scoped>
/* Use Quasar's responsive classes to control the number of columns */
.q-col-md-4 {
  @apply col-4;
}

.q-col-12 {
  @apply col-12;
}
</style>
