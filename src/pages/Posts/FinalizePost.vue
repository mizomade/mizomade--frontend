<template>
  <q-page>
    <q-dialog
      v-model="showLoadingDialog"
      persistent
      no-route-dismiss
      no-backdrop-dismiss
      no-shadow
    >
      <q-card>
        <q-card-section class="q-pa-md column items-center">
          <q-spinner color="primary" size="3em" :thickness="2" />
          <p class="text-h6 text-center q-mt-md">Sending Data...</p>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="q-pa-md container">
      <div class="q-gutter-y-md col" style="max-width: 90%">
        <p class="text-h3 text-weight-bold">Finalize Post</p>
        <q-input
          filled
          v-model="localData.data.title"
          label="Title"
          :dense="dense"
        />
        <q-select
          filled
          v-model="localData.data.category"
          :options="categories"
          label="Category"
          option-label="name"
          option-value="id"
        />

        <q-input
          filled
          v-model="localData.data.tags"
          label="Tags (separated by comma)"
          :dense="dense"
          multiple
        />

        <div>
          <p>Cover Image</p>
          <q-img :src="croppedImage" v-if="croppedImage" />
          <div v-else>
            <div v-if="localData.data.coverimage == null">
              <q-btn
                label="Upload Cover Image"
                @click="$refs.file.click()"
                :unelevated="true"
                outline=""
              />
            </div>
            <div v-else>
              <q-img :src="localData.data.coverimage" />
              <q-btn
                label="Change"
                @click="$refs.file.click()"
                :unelevated="true"
                outline=""
              />
            </div>
          </div>

          <div class="button-wrapper">
            <!-- <q-btn
              label="Change"
              @click="$refs.file.click()"
              :unelevated="true"
            /> -->

            <!-- <button class="button" @click="$refs.file.click()"> -->
            <input
              style="display: none"
              type="file"
              ref="file"
              @change="loadImage($event)"
              accept="image/*"
            />
            <!-- </button> -->
          </div>

          <q-dialog v-model="dialogVisible">
            <q-card class="dialog-container">
              <cropper
                :src="image.src"
                ref="cropperRef"
                :stencil-props="{
                  handlers: {},
                  movable: false,
                  resizable: false,
                  aspectRatio: 1.3,
                }"
                :resize-image="{
                  adjustStencil: false,
                }"
                image-restriction="stencil"
              />
              <q-card-actions align="right">
                <q-btn
                  label="Save"
                  color="black"
                  class="text-weight-bold"
                  @click="crop"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        <div class="row flex-wrap justify-between">
          <q-btn
            @click="draft"
            class="text-weight-bold text-black"
            color="white"
            outline
          >
            Draft</q-btn
          >
          <q-btn @click="submit" class="text-weight-bold" color="black">
            Post</q-btn
          >
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed, onBeforeUnmount } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { api } from './../../boot/axios';
import axios from 'axios';

import { useUserStore } from 'src/stores/user-store';
import { useRoute, useRouter } from 'vue-router';
const baseURL = api.defaults.baseURL;

// var Delta = new Quill.import('delta');
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loading = ref(true);
const dense = ref(true);
// const previewImage = ref('');
const showLoadingDialog = ref(false);
const dialogVisible = ref(false);
const croppedImage = ref(null);

function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
}

// Reactive properties
const image = ref({
  src: null,
  type: null,
});

const cropperRef = ref(null);

// Function to promisify FileReader
function readBlobAsArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e.target.error);
    reader.readAsArrayBuffer(blob);
  });
}

// Crop function
const crop = async () => {
  // console.log('Crop button clicked');

  const { canvas } = cropperRef.value.getResult();
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, image.value.type);
  });
  // localData.data.coverimage = blob;
  // canvas.toBlob((blob) => {
  //   // Do something with blob: upload to a server, download and etc.
  //   localData.data.coverimage = blob;
  //   croppedImage.value = URL.createObjectURL(blob);
  // }, 'image/jpeg');

  // const blob = await new Promise((resolve) => {
  //   canvas.toBlob(resolve, image.value.type);
  // });
  localData.data.coverimage = blob;

  croppedImage.value = URL.createObjectURL(blob);
  // localData.data.coverimage = blob;
  dialogVisible.value = false;

  // Do something with blob: upload to a server, download, etc.
};

// Load image function
const loadImage = async (event) => {
  const { files } = event.target;
  if (files && files[0]) {
    if (image.value.src) {
      URL.revokeObjectURL(image.value.src);
    }

    const blob = URL.createObjectURL(files[0]);

    try {
      const arrayBuffer = await readBlobAsArrayBuffer(files[0]);
      image.value = {
        src: blob,
        type: getMimeType(arrayBuffer, files[0].type),
      };

      dialogVisible.value = true;
    } catch (error) {
      console.error('Error reading image as ArrayBuffer:', error);
    }
  }
};

const authorization = computed(() => {
  return userStore.getAuthorization;
});

const categories = computed(() => {
  return userStore.categories;
});

const username = computed(() => {
  return userStore.getUsername;
});

// const profilePhotoLabel = 'Change Photo';

// console.log('Categories:', categories);

const localData = reactive({
  data: {},
  category: '',
});

const draft = () => {
  if (route.params.id) {
    showLoadingDialog.value = true;

    axios({
      method: 'get',
      url: baseURL + '/posts/movetodraft/' + route.params.id,

      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json, */*',
        Authorization: authorization.value,
      },
    })
      .then((res) => {
        userStore.getProfile();
        showLoadingDialog.value = false;

        router.push('/');
      })
      .catch((error) => {
        // Handle the error here
        console.error('Error creating a new post:', error);
      });
  }
};

const submit = () => {
  // const selectedImageFile = $refs.imagePicker.files[0];

  if (route.params.id) {
    showLoadingDialog.value = true;

    const form = new FormData();
    form.append('id', route.params.id);
    form.append('title', localData.data.title);
    form.append('category', localData.data.category.id);
    form.append('tags', localData.data.tags);
    // localData.data.coverimage != previewImage.value
    //   ? form.append('coverimage', localData.data.coverimage)
    //   : null;
    croppedImage.value
      ? form.append('coverimage', localData.data.coverimage, 'coverimage.png')
      : null;

    axios({
      method: 'patch',
      url: baseURL + '/posts/create/',
      data: form,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json, */*',
        Authorization: authorization.value,
      },
    })
      .then((res) => {
        const slug = res.data.slug;
        userStore.getProfile();

        goToDetail(slug);
      })
      .catch((error) => {
        // Handle the error here
        console.error('Error creating a new post:', error);
      });
  }
};

const goToDetail = (ID) => {
  showLoadingDialog.value = false;

  router.push({ name: 'PostDetail', params: { slug: ID } });
};

// const submitcoverimage = (event) => {
//   // console.log(event.target.files[0].name);
//   localData.data.coverimage = event.target.files[0];
//   // console.log(this.coverimage.name);
//   previewImage.value = URL.createObjectURL(event.target.files[0]);
// };
// const updateImage = (newImageURL) => {
//   // console.log('URL', newImageURL);
//   localData.data.coverimage = newImageURL; // Update the displayed image with the new URL
// };
onMounted(() => {
  // console.log(route.params.slug);
  if (route.params.id) {
    api.get('/drafts/' + route.params.id).then((res) => {
      localData.data = res.data.post;
      loading.value = false;
      localData.data.category = categories.value.find(
        (category) => category.name === res.data.post.category
      );

      // previewImage.value = res.data.post.coverimage;
      // const categoryName = res.data.post.category; // Assuming 'category' is the category name received from the API
      // const matchingCategory = categories.value.find(
      //   (category) => category.name === categoryName
      // );

      // if (matchingCategory) {
      //   localData.data.category = matchingCategory.id;
      // }
    });
  }
});

onBeforeUnmount(() => {
  if (image.value.src) {
    URL.revokeObjectURL(image.value.src);
  }
});
</script>
