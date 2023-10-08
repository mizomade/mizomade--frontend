<template>
  <q-page class="q-px-xl q-py-md column justify-center">
    <div>
      <h4 class="text-center">
        Tag :<b>{{ tag }} </b>
      </h4>
    </div>
    <div class="q-gutter-md flex justify-center">
      <div
        :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
        v-for="post in posts"
        :key="post"
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
      class="q-py-md"
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
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

const route = useRoute();
const $q = useQuasar();

const posts = ref([]); // Store the list of posts
const pagination = ref({}); // Store pagination data
const currentPage = ref(1); // Current page
const tag = ref(route.params.tag);
const totalPages = computed(() => {
  return Math.ceil(pagination.value.count / 12); // Assuming 10 posts per page
});

const loadPage = (page) => {
  // Make an API request to fetch posts for the given page
  api
    .get(`/tags/${tag.value}?page=${page}`)

    .then((res) => {
      posts.value = res.data.results; // Update the posts list
      pagination.value = {
        next: res.data.next,
        previous: res.data.previous,
        count: res.data.count,
      };
    })
    .catch((error) => {
      console.error('Error loading posts:', error);
    });
};

onMounted(() => {
  loadPage(currentPage.value);
  console.log();
});
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
