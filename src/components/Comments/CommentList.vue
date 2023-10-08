<template>
  <q-dialog
    v-model="showDialog"
    persistent
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="dialog-container">
      <q-card-section>
        <q-input
          v-model="newComment"
          label="Comment"
          counter
          type="textarea"
          :max-height="200"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Cancel"
          color="white"
          class="text-black text-weight-bold"
          @click="closeDialog"
        />
        <q-btn
          label="Save"
          color="black"
          class="text-weight-bold"
          @click="saveComment"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <div class="q-gutter-sm q-my-md">
    <q-separator />
    <h4>Comments</h4>
    <q-btn
      v-if="isAuthenticated"
      @click="openAddCommentDialog"
      class="text-weight-bold"
      icon="comment"
      label="Add Comment ..."
    />

    <div v-for="comment in comments" :key="comment.id">
      <CommentCard :comment="comment" @changes="changeComment" />
    </div>

    <div v-if="comments == ''">
      <p class="q-py-xl text-center">No Comments</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, computed } from 'vue';
import { comment } from 'postcss';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { useUserStore } from 'src/stores/user-store.ts';

import CommentCard from 'src/components/Comments/CommentCard.vue';

// Define props to receive post ID
const { postId } = defineProps(['postId']);
const userStore = useUserStore();

const isAuthenticated = computed(() => userStore.isAuthenticated);

// Define a ref for storing comments
const comments = ref([]);
const newComment = ref('');

// Debugging: Log the postId to see if it's being received
console.log('Received postId:', postId);

const showDialog = ref(false);

function openAddCommentDialog() {
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
}

function saveComment() {
  const form = new FormData();
  form.append('comment', newComment.value);
  try {
    api.post(`/posts/commentlist/${postId}`, form).then(() => {
      // comments.value = res.data;
      Notify.create({
        message: 'Commented!',
        color: 'green',
      });
      changeComment(true);
    });
  } catch (error) {
    console.error('Error fetching comments', error);
  }

  closeDialog();
}

// function editComment(editedComment) {
//   // Implement edit comment logic here
//   console.log('Editing comment:', editedComment);
//   openEditDialog(editComment);
// }

function changeComment(comment) {
  // Implement delete comment logic here
  if (comment) {
    try {
      api.get(`/posts/commentlist/${postId}`).then((res) => {
        comments.value = res.data;
      });
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  }
}
// Execute this code when the component is mounted
onMounted(() => {
  // You can access postId here as well
  console.log('POST ID inside onMounted:', postId);
  try {
    api.get(`/posts/commentlist/${postId}`).then((res) => {
      comments.value = res.data;
    });
  } catch (error) {
    console.error('Error fetching comments', error);
  }
});
</script>

<style></style>
