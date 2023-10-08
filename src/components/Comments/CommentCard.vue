<template>
  <q-dialog
    v-if="isUser"
    v-model="showDialog"
    persistent
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card v-if="dialogType == 'edit'" class="dialog-container">
      <q-card-section>
        <q-input
          v-model="editedCommentText"
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
    <q-card v-if="dialogType == 'delete'">
      <q-card-section>
        <p>Are you sure you want to delete this?</p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Yes"
          color="white"
          class="text-black text-weight-bold"
          @click="deleteComment"
        />
        <q-btn
          label="Cancel"
          color="black"
          class="text-weight-bold"
          @click="closeDialog"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <div class="comment-card">
    <q-card class="no-box-shadow bg-grey-2" round dense>
      <span class="row">
        <q-card-section>
          <q-avatar>
            <q-img :src="authorPhotoLink(comment.profilephoto)" size="28px" />
          </q-avatar>
        </q-card-section>

        <q-card-section class="column">
          <span
            @click="
              router.push({
                name: 'UserPage',
                params: { user: comment.user },
              })
            "
            class="cursor-pointer"
          >
            <div class="comment-header">
              <div class="comment-user-info">
                <p>
                  <span class="text-weight-bold">@{{ comment.user }} </span>.
                  <span class="text-weight-medium text-grey-6 text-caption">
                    {{ formatDate(comment.date) }}
                  </span>
                </p>
              </div>
            </div>
          </span>
          <div>
            <div class="comment-content text-weight-medium text-body2">
              {{ comment.comment }}
            </div>
          </div>
        </q-card-section>
      </span>

      <q-card-actions align="right" v-if="isUser">
        <q-btn flat @click="openEditDialog">edit</q-btn>
        <q-btn flat @click="openDeleteDialog">delete</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useUserStore } from 'src/stores/user-store.ts';
import { api, mediaPath } from 'src/boot/axios';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import { authorPhotoLink, formatDate } from 'src/boot/helpers.ts';

const router = useRouter();

const userStore = useUserStore();

const { comment } = defineProps(['comment']);
const emit = defineEmits(['changes']);
const dialogType = ref('edit');

const showDialog = ref(false);
const editedCommentText = ref(comment.comment);

function openEditDialog() {
  dialogType.value = 'edit';
  editedCommentText.value = comment.comment;
  showDialog.value = true;
}

function openDeleteDialog() {
  dialogType.value = 'delete';

  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
}

function saveComment() {
  // Save the edited comment and close the dialog
  // const editedComment = { ...comment, text: editedCommentText.value };
  // emit('edit', editedComment);
  const form = new FormData();
  form.append('id', comment.id);
  form.append('comment', editedCommentText.value);

  try {
    api.put(`/posts/commentdetail/${comment.id}`, form).then((res) => {
      // comments.value = res.data;
      Notify.create({
        message: 'Comment Edited!',
        color: 'green',
      });
      emit('changes', true);
    });
  } catch (error) {
    console.error('Error fetching comments', error);
  }
  closeDialog();
}
// function editComment() {
//   emit('edit', comment);
// }

function deleteComment() {
  try {
    api.delete(`/posts/commentdetail/${comment.id}`).then((res) => {
      // comments.value = res.data;
      Notify.create({
        message: 'Comment Deleted!',
        color: 'red',
      });
      emit('changes', true);
    });
  } catch (error) {
    console.error('Error fetching comments', error);
  }
  closeDialog();
}

const isUser = computed(() => {
  return userStore.getUsername == comment.user ? true : false;
});

// const authorPhoto = computed(() => {
//   return mediaPath + 'static/' + comment.profilephoto;
// });
</script>

<style scoped>
.comment-card {
  /* margin-bottom: 20px; */
}

.comment-header {
  /* display: flex; */
  /* align-items: center; */
}

.comment-user-info {
  /* margin-left: 10px; */
}

.comment-content {
  /* margin-top: 10px; */
}
</style>
