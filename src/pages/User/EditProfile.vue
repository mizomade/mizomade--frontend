<template>
  <div class="container">
    <q-btn
      @click="router.back()"
      icon="west"
      class="no-shadow"
      dense
      unelevated
    />
    <div
      class="q-gutter-y-md col"
      :style="$q.screen.md ? 'max-width: 90%' : 'max-width: 100%'"
    >
      <p class="text-weight-bold text-h4 text-center">Edit Profile</p>
      <!-- <hr /> -->
      <div class="flex column justify-center items-center q-gutter-md">
        <q-avatar>
          <img :src="localData.userProfile.profilephoto" sizes="80px" />
        </q-avatar>
        <image-cropper
          v-if="apiProfilePhotoUrl"
          @imagePath="updateImage"
          :username="username"
          :buttonLabel="profilePhotoLabel"
          :apiUrl="apiProfilePhotoUrl"
          :type="type1"
        ></image-cropper>
      </div>

      <div>
        <q-input
          dense
          outlined
          v-model="localData.userData.username"
          label="Username"
          @update:modelValue="checkUsernameValidity"
        ></q-input>
      </div>
      <q-input
        filled
        v-model="localData.userData.first_name"
        label="First Name"
        :dense="dense"
      />
      <q-input
        filled
        v-model="localData.userData.last_name"
        label="Last Name"
        :dense="dense"
      />

      <q-input
        filled
        v-model="localData.userProfile.bio"
        label="Bio"
        :dense="dense"
      />

      <div class="mb-2 w-auto lg:w-1/5">
        <label class="text-h6 text-weight-bold"> Cover photo </label>
        <div class="flex column justify-center items-center q-gutter-md">
          <img
            :src="localData.userProfile.coverphoto"
            style="width: 100%; height: auto"
          />
          <image-cropper
            v-if="apiCoverPhotoUrl"
            @imagePath="updateCoverImage"
            :buttonLabel="coverPhotoLabel"
            :apiUrl="apiCoverPhotoUrl"
            :username="username"
            :type="type2"
            :stencilAspectRatio="1.4"
          ></image-cropper>
        </div>
      </div>

      <div class="row justify-between">
        <q-btn @click="router.back()" color="grey-8" class="text-weight-bold"
          >Cancel</q-btn
        >

        <q-btn @click="submit" color="black" class="text-weight-bold"
          >Save</q-btn
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue';

import { api } from './../../boot/axios';
import axios from 'axios';
import ImageCropper from 'src/components/ImageCropper.vue';

import { useUserStore } from 'src/stores/user-store';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const baseURL = api.defaults.baseURL;
const isUsernameValid = ref(true);

// var Delta = new Quill.import('delta');
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loading = ref(true);
const dense = ref(true);
const previewImage = ref('');
const previewCoverImage = ref('');
const focused = ref(false);
const initUsername = ref('');
const profilePhoto = ref('');
const type1 = 'profilephoto';
const type2 = 'coverphoto';

const authorization = computed(() => {
  return userStore.getAuthorization;
});

const userData = computed(() => {
  return userStore.userData;
});

const username = computed(() => {
  return userStore.getUsername;
});

const userProfile = computed(() => {
  return userStore.profile;
});

const localData = reactive({
  data: {},
  userData: userData,
  userProfile: userProfile,
});
const apiProfilePhotoUrl = computed(() => {
  return '/user/profile/update/profilephoto/' + localData.userData.id;
});
const profilePhotoLabel = 'Change Photo';
const apiCoverPhotoUrl = computed(() => {
  return '/user/profile/update/coverphoto/' + localData.userData.id;
});
const coverPhotoLabel = 'Change Cover Photo';
const checkUsernameValidity = async () => {
  if (initUsername.value == localData.data.username) {
    isUsernameValid.value = true;
  } else {
    try {
      const response = await api.get(
        `user/profile/usernamevalidation/${localData.userData.username}`
      );
      // isUsernameValid.value = response.data[0] === 1;
      if (response.data[0] == 1) {
        isUsernameValid.value = true;
        $q.notify({
          message: 'Username  valid',
          color: 'green',
        });
      }
      if (response.data[0] == 0) {
        isUsernameValid.value = false;
        $q.notify({
          message: 'Username  taken',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error checking username validity:', error);
      isUsernameValid.value = false;
      $q.notify({
        message: 'Username not valid',
        color: 'red',
      });
    }
  }
};
// watch(localData.userData.username, () => {
//   isUsernameValid.value = null; // Reset validation state while typing
//   checkUsernameValidity();
// });

const submit = () => {
  // const selectedImageFile = $refs.imagePicker.files[0];
  checkUsernameValidity();

  if (isUsernameValid.value == true) {
    const forms = new FormData();
    forms.append('username', localData.userData.username);
    forms.append('first_name', localData.userData.first_name);

    forms.append('last_name', localData.userData.last_name);
    forms.append('bio', localData.userProfile.bio);

    axios({
      method: 'put',
      url: baseURL + '/user/profile/update/' + localData.userData.id,
      data: forms,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json, */*',
        Authorization: authorization.value,
      },
    }).then(() => {
      $q.notify({
        message: 'Profile Updated!',
        color: 'green',
      });
      userStore.getProfile();
      // router.back(-1);
    });
  }
};

const updateImage = (newImageURL) => {
  // console.log('URL', newImageURL);
  localData.userProfile.profilephoto = newImageURL; // Update the displayed image with the new URL
};

const updateCoverImage = (newImageURL) => {
  console.log('URL', newImageURL);
  localData.userProfile.coverphoto = newImageURL; // Update the displayed image with the new URL
};
</script>
