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

      <!-- <q-avatar>
        <img :src="localData.userProfile.profilephoto" />
      </q-avatar> -->

      <span v-if="previewImage" class="text-center">
        <q-avatar>
          <img :src="previewImage" sizes="80px" />
        </q-avatar>
        <br />

        <input
          id="file-uploadagain"
          name="file-uploadagain"
          type="file"
          @change="updateprofilephoto"
        />
        <label for="file-uploadagain" class="">Change </label>
      </span>
      <div class="text-center" v-else>
        <label class="text-h6 text-weight-bold"> Profile photo </label>
        <br />
        <q-avatar size="80px" class="q-my-md">
          <img :src="localData.userProfile.profilephoto" />
        </q-avatar>
        <br />
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          class="sr-only"
          @change="updateprofilephoto"
        />
        <label for="file-upload" class="bg-red">Change </label>
      </div>

      <q-input
        filled
        v-model="localData.userData.username"
        label="username"
        :dense="dense"
      />
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

      <div></div>

      <div class="mb-2 w-auto lg:w-1/5" v-if="!previewCoverImage">
        <label class="text-h6 text-weight-bold"> Cover photo </label>
        <img
          :src="localData.userProfile.coverphoto"
          style="width: 100%; height: auto"
        />

        <input
          id="file-upload"
          name="file-upload"
          type="file"
          class="sr-only"
          @change="submitcoverimage"
        />
      </div>
      <span v-if="previewCoverImage" style="margin: 1rem 0">
        <img :src="previewCoverImage" style="width: 100%; height: auto" />
        <label
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
      <!-- post: {{ localData.userProfile.coverphoto }} preview:{{
        previewCoverImage
      }} -->

      <div class="row justify-between">
        <q-btn @click="draft" color="grey-8" class="text-weight-bold"
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
import { ref, onMounted, reactive, computed } from 'vue';

import { api } from './../../boot/axios';
import axios from 'axios';

import { useUserStore } from 'src/stores/user-store';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const baseURL = api.defaults.baseURL;

// var Delta = new Quill.import('delta');
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loading = ref(true);
const dense = ref(true);
const previewImage = ref('');
const previewCoverImage = ref('');

const authorization = computed(() => {
  return userStore.getAuthorization;
});

const userData = computed(() => {
  return userStore.userData;
});

const userProfile = computed(() => {
  return userStore.profile;
});

const localData = reactive({
  data: {},
  userData: userData,
  userProfile: userProfile,
});

const submit = () => {
  // const selectedImageFile = $refs.imagePicker.files[0];

  // if (route.params.id) {
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
  });
  // }
};

const submitcoverimage = (event) => {
  // console.log(event.target.files[0].name);
  localData.userProfile.coverphoto = event.target.files[0];
  // console.log(this.coverimage.name);
  previewCoverImage.value = URL.createObjectURL(event.target.files[0]);
  submitcoverimageAPI();
};
const submitcoverimageAPI = () => {
  const form = new FormData();

  localData.userProfile.coverphoto != previewCoverImage.value
    ? form.append('coverphoto', localData.userProfile.coverphoto)
    : null;
  form.append('username', localData.userData.username);

  api.put(
    baseURL + '/user/profile/update/coverphoto/' + localData.userData.id,
    form
  );
};

const updateprofilephoto = (event) => {
  // console.log(event.target.files[0].name);
  localData.userProfile.profilephoto = event.target.files[0];
  // console.log(this.coverimage.name);
  previewImage.value = URL.createObjectURL(event.target.files[0]);
  updateprofilephotoAPI();
};

const updateprofilephotoAPI = () => {
  const form = new FormData();
  localData.userProfile.profilephoto != previewImage.value
    ? form.append('profilephoto', localData.userProfile.profilephoto)
    : null;
  form.append('username', localData.userData.username);

  api.put(
    baseURL + '/user/profile/update/profilephoto/' + localData.userData.id,
    form
  );
};
//  const updatecoverphoto =(event)=> {
//       const data = new FormData();

//       data.append("coverphoto", event.target.files[0]);
//       data.append("username", this.store.getUserName);

//       api.put(baseURL
//             ,"/user/profile/update/coverphoto/" +
//             localData.userData.id,
//           data,

//         )
//         .then(() => {
//           // console.log("image upload response > ", response);
//           this.usermedia.coverphoto = URL.createObjectURL(
//             event.target.files[0]
//           );
//            this.$root.$toast.success("Cover photo Updated",{
//             duration: 2000,
//             position: 'bottom-center',
//           });
//         });
//     },

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
