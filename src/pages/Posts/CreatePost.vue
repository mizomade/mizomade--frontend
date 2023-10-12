<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm container">
      <!-- <QuillEditor v-model:value="state.content" :options="options" ref="q" />
    {{ ourQuill }} -->
      <p class="text-h4 text-weight-bold">Write a post</p>
      <div class="quill-container">
        <div ref="q"></div>
      </div>

      <div class="row flex-wrap justify-between">
        <q-btn
          @click="router.back()"
          class="text-weight-bold text-black"
          color="white"
          outline
        >
          Cancel</q-btn
        >
        <q-spinner
          color="primary"
          size="3em"
          :thickness="2"
          v-if="uploadLoading"
        />
        <q-btn
          @click="next"
          class="text-weight-bold"
          color="black"
          :disable="uploadLoading"
        >
          Save & Next</q-btn
        >
      </div>

      <!-- <q-btn @click="insertText"> Do</q-btn>
    <q-btn @click="deleteText"> Do</q-btn> -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Quill from 'quill';
import { ref, onMounted, reactive, computed } from 'vue';
// import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { api } from './../../boot/axios';
import axios from 'axios';

import { useUserStore } from 'src/stores/user-store';
import { useRoute, useRouter } from 'vue-router';

// var Delta = new Quill.import('delta');
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
let quill = '';

const q = ref('Write a post to mizomade ... ');
const loading = ref(true);
// const ready = ref(false);
const baseURL = api.defaults.baseURL;
const uploadLoading = ref(false);

// const ourQuill = computed(() => {
//   return q.value;
// });

const authorization = computed(() => {
  return userStore.getAuthorization;
});

const localData = reactive({
  data: {},
  related: {},
  selectedData: {},
});

// const handleImageInsertion = () => {
//   const input = document.createElement('input');
//   input.setAttribute('type', 'file');
//   input.setAttribute('accept', 'image/*');
//   input.style.display = 'none'; // Hide the input element

//   input.addEventListener('change', async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         // Upload the image to the server and get the image URL
//         const imageUrl = await uploadImageToServer(file);

//         // Insert the image into the Quill editor
//         const quill = q.value;
//         const range = quill.getSelection(true);
//         quill.insertEmbed(range.index, 'image', imageUrl, Quill.sources.USER);
//       } catch (error) {
//         console.error('Error uploading image:', error);
//       }
//     }
//   });

//   // Trigger a click event on the hidden input element
//   input.click();
// };
// // Function to upload the image to the server
// const uploadImageToServer = async (file) => {
//   try {
//     const formData = new FormData();
//     formData.append('image', file);

//     const response = await axios.post(
//       baseURL + '/posts/imageupload/',
//       formData,
//       {
//         headers: {
//           Accept: 'application/json, text/plain, */*',
//           Authorization: authorization.value,
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );

//     return response.data.imageUrl; // Assuming the server responds with the image URL
//   } catch (error) {
//     throw error;
//   }
// };

const options = reactive({
  // debug: 'info',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],

      [{ size: ['small', false, 'large', 'huge'] }],
      // [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image'],
      // [
      //   {
      //     image: handleImageInsertion,
      //   },
      // ],
    ],
  },
  placeholder: 'Write a post for Mizomade.... \n \n \n ',
  readOnly: false,
  theme: 'snow',
});

// const state = reactive({
//   curTheme: 'snow',
//   showEditor: true,
//   content: '<p>2333</p>',
//   editorOption: {
//     placeholder: 'core',
//     modules: {
//       // imageUploader: {
//       //   upload: (file) => {
//       //     console.log(file);
//       //     return new Promise((resolve, reject) => {
//       //       console.log(reject);
//       //       setTimeout(() => {
//       //         resolve(
//       //           'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png'
//       //         );
//       //       }, 3500);
//       //     });
//       //   },
//       // },
//       toolbar: [
//         ['bold', 'italic', 'underline', 'strike'],
//         ['blockquote', 'code-block'],
//         [{ header: 1 }, { header: 2 }],
//         [{ list: 'ordered' }, { list: 'bullet' }],
//         [{ script: 'sub' }, { script: 'super' }],
//         [{ indent: '-1' }, { indent: '+1' }],
//         [{ direction: 'rtl' }],
//         [{ size: ['small', false, 'large', 'huge'] }],
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         [{ color: [] }, { background: [] }],
//         [{ font: [] }],
//         [{ align: [] }],
//         ['clean'],
//         ['link', 'image', 'video'],
//       ],
//     },
//   },
//   disabled: true,
// });

const next = () => {
  if (route.params.id) {
    // var delta = q.value.getContents();
    uploadLoading.value = true;

    var delta = quill.getContents();
    const data = {
      content: JSON.stringify(delta.ops),
      id: route.params.id,
    };

    // const form = new FormData();
    // form.append('id', route.params.id);
    // form.append('content', data);

    axios({
      method: 'PATCH',
      url: baseURL + '/posts/createdraft/',
      data,
      headers: {
        Accept: 'application/json, text/plain, */* ',
        Authorization: authorization.value,
      },
    }).then((res) => {
      userStore.getProfile();
      // console.log('GETTING USER PROFILE');

      const id = res.data.id;
      goToDetail(id);
    });
  } else {
    // const form = new FormData();
    var delta = quill.getContents();

    // var delta = q.value.getContents();
    const data = {
      content: JSON.stringify(delta.ops),
    };

    // form.append('content', data);
    // const apiUrl = 'https://mizomade.pythonanywhere.com';

    console.log('API' + baseURL);
    axios({
      method: 'POST',
      url: baseURL + '/posts/createdraft/',
      data,
      headers: {
        Accept: 'application/json, text/plain, */* ',
        Authorization: authorization.value,
      },
    }).then((res) => {
      userStore.getProfile();

      const id = res.data.id;
      goToDetail(id);
    });
  }
};

const goToDetail = (ID) => {
  router.push({ name: 'FinalizePost', params: { id: ID } });
};

// const doThis = () => {
//   const quillInstance = q.value.quill;

//   // Perform the text insertion
//   quillInstance.insertText(0, 'Hello', 'link', 'https://world.com');
// };
// onMounted(() => {
//   // console.log(route.params.slug);
//   if (route.params.id) {
//     api.get('/drafts/' + route.params.id).then((res) => {
//       console.log(res);
//       localData.data = res.data.post;
//       // Convert Delta to HTML
//       var deltaFormat = res.data.post.content;
//       // var converter = Quill.import('delta');
//       // const content = converter.convert(deltaFormat);
//       // q.value = deltaFormat;
//       const formattedContents = JSON.parse(deltaFormat);

//       q.value.setContents(formattedContents, 'api');

//       loading.value = false;
//     });
//   }

//   // q.value.getModule('toolbar').addHandler('image', () => {
//   //   const input = document.createElement('input');
//   //   input.setAttribute('type', 'file');
//   //   input.setAttribute('accept', 'image/*');
//   //   input.click();

//   //   input.addEventListener('change', () => {
//   //     const file = input.files[0];

//   //     if (file) {
//   //       // You can use a service or API to upload the image and get the URL.
//   //       // Replace 'uploadImageUrl' with your actual image upload endpoint.
//   //       const uploadImageUrl = baseURL + '/posts/imageupload/';

//   //       const formData = new FormData();
//   //       formData.append('image', file);

//   //       // Make a POST request to your image upload endpoint.
//   //       fetch(uploadImageUrl, {
//   //         method: 'POST',
//   //         body: formData,
//   //       })
//   //         .then((response) => response.json())
//   //         .then((data) => {
//   //           const imageUrl = data.image; // Adjust this based on your API response.
//   //           const range = q.value.getSelection();
//   //           q.value.insertEmbed(range.index, 'image', imageUrl);
//   //         })
//   //         .catch((error) => {
//   //           console.error('Image upload error:', error);
//   //         });
//   //     }
//   //   });
//   // });
// });

const insertText = () => {
  const range = quill.getSelection();
  // quill.blur();

  quill.insertText(range.index, 'Inserting Image .... Please wait', {
    color: '#000000',
    bold: true,
    // attributes: { header: 1 },
    // header: 1,
    size: 'large',
    italic: true,
  });
};

const deleteText = () => {
  const range = quill.getSelection();

  quill.deleteText(range.index - 20, range.index);
};

onMounted(() => {
  quill = new Quill(q.value, options);

  // Custom image handler
  quill.getModule('toolbar').addHandler('image', () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.addEventListener('change', () => {
      const file = input.files[0];

      if (file) {
        insertText();
        // You can use a service or API to upload the image and get the URL.
        // Replace 'uploadImageUrl' with your actual image upload endpoint.
        const uploadImageUrl = baseURL + '/posts/imageupload/';

        const formData = new FormData();
        formData.append('image', file);

        // Make a POST request to your image upload endpoint.
        fetch(uploadImageUrl, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            deleteText();
            const imageUrl = data.image; // Adjust this based on your API response.
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', imageUrl);
          })
          .catch((error) => {
            console.error('Image upload error:', error);
          });
      }
    });
  });

  if (route.params.id) {
    api.get('/drafts/' + route.params.id).then((res) => {
      console.log(res);
      localData.data = res.data.post;
      // Convert Delta to HTML
      var deltaFormat = res.data.post.content;
      // var converter = Quill.import('delta');
      // const content = converter.convert(deltaFormat);
      // q.value = deltaFormat;
      const formattedContents = JSON.parse(deltaFormat);

      quill.setContents(formattedContents, 'api');

      loading.value = false;
    });
  }
});
</script>

<style scoped>
.quill-container ::v-deep p {
  font-family: 'Open Sans', sans-serif; /* Replace with your desired font family */
  /* Add any other CSS properties you want to apply to <p> elements */
  font-size: 16px;
}

.quill-container ::v-deep li {
  font-family: 'Open Sans', sans-serif; /* Replace with your desired font family */
  /* Add any other CSS properties you want to apply to <p> elements */
  font-size: 16px;
}
</style>
