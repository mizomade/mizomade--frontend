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
          v-model="localData.category"
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
          <!-- <q-input
          ref="imagePicker"
          v-model="localData.data.coverimage"
          accept="image/*"
          @change="onImageSelected"
          label="Select Image"
        /> -->
          <!-- <q-file
          filled
          v-model="localData.data.coverimage"
          label="Filled"
          @update:model-value="onImageSelected"
        /> -->

          <!-- <q-file
          v-model="localData.data.coverimage"
          accept="image/*"
          label="Select Image"
          use-chips
          @change="onImageSelected"
        /> -->
          <!-- <q-img
          v-if="localData.data.coverimage"
          :src="localData.data.coverimage"
          @click="displayImage"
          class="cursor-pointer"
        /> -->
        </div>
        <div v-if="localData.data.coverimage">
          <!-- <q-img :src="localData.data.coverimage" />
        <p>Change</p> -->
        </div>

        <div v-else>
          <!-- <q-uploader label="Auto Uploader" auto-upload />
        <q-file
          clearable
          color="orange"
          standout
          bottom-slots
          v-model="localData.data.coverimage"
          label="Coverimage"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>

          <template v-slot:hint> Field hint </template>
        </q-file> -->
        </div>
        <!-- {{ localData.data.coverimage }} -->

        <div class="mb-2 w-auto lg:w-1/5" v-if="!previewImage">
          <label class="mr-4 text-gray-700 font-bold inline-block mb-2">
            Cover photo
          </label>

          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          >
            <div class="space-y-1 text-center">
              <div class="flex text-sm text-gray-600">
                <label
                  for="file-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    class="sr-only"
                    @change="submitcoverimage"
                  />
                </label>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        <span v-if="previewImage" style="margin: 1rem 0">
          <img :src="previewImage" style="width: 100%; height: auto" />
          <label
            for="file-uploadagain"
            class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >Change
            <input
              id="file-uploadagain"
              name="file-uploadagain"
              type="file"
              class="sr-only"
              @change="submitcoverimage"
              placeholder="Change"
            />
          </label>
        </span>
        <!-- post: {{ localData.data.coverimage }} preview:{{ previewImage }} -->

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
import { ref, onMounted, reactive, computed } from 'vue';

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
const previewImage = ref('');
const showLoadingDialog = ref(false);

const authorization = computed(() => {
  return userStore.getAuthorization;
});

const categories = computed(() => {
  return userStore.categories;
});

console.log('Categories:', categories);

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
    form.append('category', localData.category.id);
    form.append('tags', localData.data.tags);
    localData.data.coverimage != previewImage.value
      ? form.append('coverimage', localData.data.coverimage)
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

const submitcoverimage = (event) => {
  // console.log(event.target.files[0].name);
  localData.data.coverimage = event.target.files[0];
  // console.log(this.coverimage.name);
  previewImage.value = URL.createObjectURL(event.target.files[0]);
};

onMounted(() => {
  // console.log(route.params.slug);
  if (route.params.id) {
    api.get('/drafts/' + route.params.id).then((res) => {
      localData.data = res.data.post;
      loading.value = false;
      previewImage.value = res.data.post.coverimage;
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
</script>
