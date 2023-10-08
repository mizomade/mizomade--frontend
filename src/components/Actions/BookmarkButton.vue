<template>
  <div @click="toggleBookmark" v-if="isAuthenticated" class="cursor-pointer">
    <q-icon name="bookmark" v-if="isBookmarked" size="32px"></q-icon>
    <q-icon name="bookmark_border" v-else size="32px"></q-icon>
  </div>

  <div @click="showBottomSheet" v-else class="cursor-pointer">
    <q-icon name="bookmark_border" size="32px"></q-icon>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue';
import { useUserStore } from 'src/stores/user-store.ts';
import { api } from 'src/boot/axios';
import { useQuasar, Notify } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();

const $q = useQuasar();

const userStore = useUserStore();

const { postData } = defineProps(['postData']);
const emit = defineEmits(['changes']);
const bookmarked = ref(false);

const isAuthenticated = computed(() => userStore.isAuthenticated);

const isBookmarked = computed(() => {
  const postSlug = postData.slug; // Replace with the ID of the post you want to check
  return userStore.isPostBookmarked(postSlug);
});

const toggleBookmark = () => {
  userStore.toggleBookmark(postData);
};

const showBottomSheet = (grid) => {
  $q.bottomSheet({
    message: 'Login required',
    grid,
    actions: [
      {
        label: 'Click to login',
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        id: 'login',
      },
    ],
  })
    .onOk((action) => {
      // console.log('Action chosen:', action.id)
      if (action.id === 'login') {
        // Route to the login page
        router.push('/login'); // Replace with your actual login page route
      }
    })
    .onCancel(() => {
      // console.log('Dismissed')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
</script>
