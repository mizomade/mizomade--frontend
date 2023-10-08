<template>
  <q-page v-if="loading" class="row justify-center items-center">
    <q-spinner color="primary" size="3em" :thickness="4" />
  </q-page>
  <q-page v-else class="q-px-xl q-py-md column justify-center">
    <div>
      <h4 class="text-center">
        Search :<b>{{ q }} </b>
      </h4>
    </div>

    <div class="q-gutter-md flex justify-center q-mb-md">
      <div
        :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
        v-for="user in users"
        :key="user"
      >
        <span>
          <q-card
            class="my-card cursor-pointer"
            flat
            bordered
            @click="goTo(user.username)"
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="authorPhotoLink(user.profilephoto)" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>@{{ user.username }}</q-item-label>
                <q-item-label caption>
                  {{ user.firstname }} {{ user.lastname }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
          </q-card>
        </span>
      </div>
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
import { ref, onMounted, computed, watch } from 'vue';
import { api } from 'src/boot/axios';
import PostCard from 'components/PostCard.vue';
import { useQuasar } from 'quasar';
import { authorPhotoLink } from 'src/boot/helpers';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();

const router = useRouter();
const $q = useQuasar();
const loading = ref(true);

const posts = ref([]); // Store the list of posts
const users = ref([]); // Store the list of posts

const pagination = ref({}); // Store pagination data
const currentPage = ref(1); // Current page
const q = ref(route.params.q);
const totalPages = computed(() => {
  return Math.ceil(pagination.value.count / 12); // Assuming 10 posts per page
});

watch(
  () => route.params.q,
  (newQ) => {
    loading.value = true;

    q.value = newQ;
    currentPage.value = 1; // Reset to the first page when the search query changes
    loadPage(currentPage.value);
  }
);

const loadPage = (page) => {
  // Make an API request to fetch posts for the given page
  api
    .get(`/searching/${q.value}?page=${page}`)

    .then((res) => {
      posts.value = res.data.results[0]; // Update the posts list
      users.value = res.data.results[1]; // Update the posts list

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

const goTo = (username) => {
  router.push({ name: 'UserPage', params: { user: username } });
};

onMounted(() => {
  loading.value = true;
  loadPage(currentPage.value);
  // console.log();
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
