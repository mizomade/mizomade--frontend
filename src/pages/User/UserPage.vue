<template>
  <q-dialog
    v-if="dialogType == 'delete'"
    v-model="showDialog"
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="dialog-container">
      <q-card-section>
        <p>Are you sure you want to delete this post ?</p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Cancel"
          color="white"
          class="text-black text-weight-bold"
          @click="toggleDialog"
        />
        <q-btn
          label="Yes"
          color="black"
          class="text-weight-bold"
          @click="deletePost(deleteId)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-page>
    <div class="">
      <q-img width="full" height="300px" :src="userProfile.coverphoto" />
      <div class="fit column wrap justify-start items-center content-center">
        <q-avatar class="q-ma-md" size="80px">
          <q-img :src="userProfile.profilephoto" />
        </q-avatar>
        <p class="text-weight-bold">
          {{ userData.first_name }} {{ userData.last_name }}
        </p>

        <span class="text-weight-bold text-grey-9 q-pa-lg">
          " {{ userProfile.bio }} "
        </span>

        <q-btn
          v-if="isUser"
          @click="router.push({ name: 'EditProfile' })"
          label="Edit Profile"
          class="text-weight-bold q-mb-md"
        />
      </div>

      <q-separator />

      <div class="">
        <q-tabs
          v-model="tab"
          dense
          align="center"
          class="bg-white text-grey-200"
          :breakpoint="0"
        >
          <q-tab
            name="posts"
            icon="ballot"
            label="Posts"
            class="text-weight-bold"
          />
          <q-tab
            v-if="isUser"
            name="drafts"
            icon="mode_edit_outlined"
            label="Drafts"
            class="text-weight-bold"
          />
          <q-tab
            v-if="isUser"
            name="bookmark"
            icon="bookmark"
            label="Bookmarks"
            class="text-weight-bold"
          />
        </q-tabs>
      </div>

      <q-tab-panels v-model="tab" animated class="container">
        <q-tab-panel name="posts" class="">
          <div class="q-pa-md q-gutter-md">
            <div class="q-gutter-md flex justify-center">
              <div
                v-if="loading"
                :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
              >
                <SkeletonPostCard />
              </div>
              <div
                v-else
                :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
                v-for="post in posts"
                :key="post"
              >
                <post-card
                  v-if="post.published"
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
          </div>
        </q-tab-panel>
        <q-tab-panel v-if="isUser" name="drafts">
          <div class="q-pa-md q-gutter-md">
            <div class="q-gutter-md col">
              <div
                v-if="loading"
                :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
              >
                Loading...
              </div>
              <div
                v-else
                class="col-3"
                v-for="post in userStore.postList"
                :key="post"
              >
                <q-item bordered class="rounded-borders" v-if="!post.published">
                  <q-item-section avatar top>
                    <q-img :src="post.coverimage" color="black" size="50px" />
                  </q-item-section>

                  <q-item-section top>
                    <q-item-label lines="1">
                      <span class="text-weight-bold">{{
                        post.title ?? 'No Title'
                      }}</span>
                      <!-- <span class="text-grey-8"> - GitHub repository</span> -->
                    </q-item-label>

                    <q-item-label
                      lines="1"
                      class="q-mt-xs text-body2 text-weight-light text-primary text-uppercase"
                    >
                      <span class="cursor-pointer">{{
                        formatDate(post.date)
                      }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn icon="more_vert" no-shadow>
                        <q-menu>
                          <q-list style="min-width: 100px">
                            <q-item
                              clickable
                              v-close-popup
                              @click="
                                router.push({
                                  name: 'DraftPost',
                                  params: {
                                    id: post.id,
                                  },
                                })
                              "
                            >
                              <q-item-section>Edit</q-item-section>
                            </q-item>
                            <q-item
                              clickable
                              v-close-popup
                              @click="initDelete(post.id)"
                            >
                              <q-item-section>Delete</q-item-section>
                            </q-item>
                            <q-separator />
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </div>

              <!-- Pagination -->

              <!-- {{ pagination }} -->
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel v-if="isUser" name="bookmark">
          <div class="q-pa-md q-gutter-md">
            <div class="q-gutter-md flex justify-center">
              <div
                v-if="loading"
                :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
              >
                <SkeletonPostCard />
              </div>
              <div
                v-else
                :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
                v-for="post in userStore.bookmarkedList"
                :key="post"
              >
                <post-card
                  v-if="post.published"
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
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/user-store.ts';

import { ref, onMounted, computed, watch } from 'vue';
import { api } from 'src/boot/axios';
import PostCard from 'components/PostCard.vue';
import SkeletonPostCard from 'components/SkeletonPostCard.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { formatDate } from 'src/boot/helpers';

const $q = useQuasar();
const userStore = useUserStore();

const route = useRoute();
const router = useRouter();
const userData = ref([]);
const userProfile = ref([]);
const bookmarkedList = ref([]);

const tab = ref('posts');
const showDialog = ref(false);
const dialogType = ref('');
const deleteId = ref('');

const posts = ref([]); // Store the list of posts
const pagination = ref({}); // Store pagination data
const currentPage = ref(1); // Current page
const loading = ref(true);

const baseURL = api.defaults.baseURL;

const totalPages = computed(() => {
  return Math.ceil(pagination.value.count / 12); // Assuming 10 posts per page
});

const isUser = computed(() => {
  return userStore.getUsername == route.params.user ? true : false;
});
const authorization = computed(() => {
  return userStore.getAuthorization;
});

// Watch for changes in the data from the store
watch(
  () => [userStore.postList, userStore.userData, userStore.profile],
  () => {
    // Update your component's data here
    loading.value = false; // Loading indicator can be turned off when data is available
  }
);

const toggleDialog = () => {
  showDialog.value = !showDialog.value;
};

const loadPage = (username = route.params.user) => {
  // Make an API request to fetch posts for the given page
  api
    .get(`/user/profile/${username}`)

    .then((res) => {
      posts.value = res.data[2]; // Update the posts list
      userData.value = res.data[0];
      userProfile.value = res.data[1];

      // pagination.value = {
      //   next: res.data.next,
      //   previous: res.data.previous,
      //   count: res.data.count,
      // };
      loading.value = false;
    })
    .catch((error) => {
      console.error('Error loading posts:', error);
    });
};

const initDelete = (postId) => {
  dialogType.value = 'delete';
  showDialog.value = true;
  deleteId.value = postId;
};

const deletePost = (postId) => {
  // Make an API request to fetch posts for the given page
  if (postId) {
    axios({
      method: 'DELETE',
      url: baseURL + '/posts/delete/' + postId,

      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json, */*',
        Authorization: authorization.value,
      },
    })
      .then((res) => {
        showDialog.value = false;
        $q.notify({
          message: 'Post Deleted',
        });
      })
      .catch((error) => {
        $q.notify({
          message: 'Error! Please refresh page',
          color: 'red',
        });
        // Handle the error here
        // console.error('Error creating a new post:', error);
      });
  }
};

const assignUserValues = () => {
  posts.value = userStore.postList; // Update the posts list
  userData.value = userStore.userData;
  userProfile.value = userStore.profile;
};

onMounted(() => {
  isUser.value ? userStore.getProfile() : null;
  isUser.value ? assignUserValues() : loadPage();
});
</script>
