<template>
  <div>
    <!-- <q-img :src="image.src" /> -->
    <!-- <q-btn @click="toggleDialog"> Add</q-btn> -->

    <div class="button-wrapper">
      <q-btn
        :label="buttonLabel ?? 'Change'"
        @click="$refs.file.click()"
        :unelevated="true"
        outline=""
      />

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

    <q-dialog v-model="dialogVisible" @hide="onDialogClosed">
      <q-card class="dialog-container">
        <cropper
          :src="image.src"
          ref="cropperRef"
          :stencil-props="{
            handlers: {},
            movable: false,
            resizable: false,
            aspectRatio: stencilAspectRatio ?? 1,
          }"
          :resize-image="{
            adjustStencil: false,
          }"
          image-restriction="stencil"
        />
        <q-card-actions align="right">
          <!-- <q-btn
            label="Cancel"
            color="white"
            class="text-black text-weight-bold"
            @click="uploadToAPI"
          /> -->
          <q-btn
            label="Save"
            color="black"
            class="text-weight-bold"
            @click="crop"
            :loading="submitting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { Cropper } from 'vue-advanced-cropper';
import axios from 'src/boot/axios';
import 'vue-advanced-cropper/dist/style.css';
const $q = useQuasar();
const submitting = ref(false);

const baseURL = api.defaults.baseURL;

const props = defineProps({
  type: String,
  apiUrl: String,
  stencilAspectRatio: Number,
  username: String,
  buttonLabel: String,
  methods: String,
  authorization: String,
}); // Add the props
const emits = defineEmits(['imagePath']);

const dialogVisible = ref(false);

const cropperOptions = {
  // Configure cropper options if needed
};

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
  submitting.value = true;
  // console.log('Crop button clicked');

  const { canvas } = cropperRef.value.getResult();
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, image.value.type);
  });

  // Do something with blob: upload to a server, download, etc.
  const form = new FormData();
  form.append('username', props.username);
  if (props.type == 'profilephoto') {
    form.append('profilephoto', blob, 'profilephoto.jpg');
  }
  if (props.type == 'coverphoto') {
    form.append('coverphoto', blob, 'coverphoto.jpg');
  }
  if (props.type == 'coverimage') {
    form.append('coverimage', blob, 'coverimage.jpg');
  }
  try {
    // const response =
    // props.methods == 'POST'
    //   ? await axios({
    //       method: 'POST',
    //       url: baseURL + props.apiUrl,
    //       data: form,

    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //         Accept: 'application/json, */*',
    //         Authorization: authorization.value,
    //       },
    //     })
    //   : await api.put(baseURL + props.apiUrl, form);
    const response = await api.put(baseURL + props.apiUrl, form);
    // Handle the response from the server
    if (response.status === 200) {
      // Successfully uploaded
      // You may want to handle this based on your API response
      // console.log(response.data.url);
      emits('imagePath', response.data.url);
      submitting.value = false;

      dialogVisible.value = false;
    } else {
      // Handle the error
    }
  } catch (error) {
    // Handle API call error
  }
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

// Clean up before component unmounts
onBeforeUnmount(() => {
  if (image.value.src) {
    URL.revokeObjectURL(image.value.src);
  }
});

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};
</script>
