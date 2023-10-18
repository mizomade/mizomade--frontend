<template>
  <div>
    {{ image.src }}
    <q-btn @click="toggleDialog"> Add</q-btn>
    <div class="button-wrapper">
      <button class="button" @click="$refs.file.click()">
        <input
          type="file"
          ref="file"
          @change="loadImage($event)"
          accept="image/*"
        />
        Load image
      </button>
    </div>

    <q-dialog v-model="dialogVisible" @hide="onDialogClosed">
      <q-card class="dialog-container">
        <cropper :src="image.src" ref="cropper" />
        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            color="white"
            class="text-black text-weight-bold"
            @click="uploadToAPI"
          />
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
</template>

<script setup>
import { ref, defineProps, defineEmits, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
const $q = useQuasar();
const baseURL = api.defaults.baseURL;
const cropper = ref(null);

const { imagePath } = defineProps(['imagePath']);
const emits = defineEmits(['imagePath']);

const dialogVisible = ref(false);
const selectedImage = ref(imagePath || null);
const croppedImage = ref(null);
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
const cropperResult = ref(null);

// Crop function
const crop = () => {
  const { canvas } = cropperResult.value;
  canvas.toBlob((blob) => {
    // Do something with blob: upload to a server, download, etc.

    const form = new FormData();
    form.append('profilephoto', blob, 'profilephoto.jpg');

    // Make your API call here to upload the blob to the server
    api
      .put(baseURL + '/user/profile/update/profilephoto/' + 2, form)
      .then((response) => {
        // Handle the response from the server
        if (response.status === 200) {
          // Successfully uploaded
          // You may want to handle this based on your API response
        } else {
          // Handle the error
        }
      })
      .catch((error) => {
        // Handle API call error
      });
  }, image.value.type);
};

// Reset function
const reset = () => {
  image.value = {
    src: null,
    type: null,
  };
};

// Load image function
const loadImage = (event) => {
  const { files } = event.target;
  if (files && files[0]) {
    if (image.value.src) {
      URL.revokeObjectURL(image.value.src);
    }

    const blob = URL.createObjectURL(files[0]);

    const reader = new FileReader();
    reader.onload = (e) => {
      image.value = {
        src: blob,
        type: getMimeType(e.target.result, files[0].type),
      };
    };

    reader.readAsArrayBuffer(files[0]);
    dialogVisible.value = true;
  }
};

// Clean up before component unmounts
onBeforeUnmount(() => {
  if (image.value.src) {
    URL.revokeObjectURL(image.value.src);
  }
});

const openDialog = () => {
  dialogVisible.value = true;
};
const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
  // Handle dialog closed event (e.g., cleanup).
};

const onDialogClosed = () => {
  dialogVisible.value = false;
  // Handle dialog closed event (e.g., cleanup).
};

// const onImageChange = ({ coordinates, canvas }) => {
//   // Handle image change (cropping) here.
// };

// const sendCroppedImage = () => {
//   // uploadToAPI();
//   if (croppedImage.value) {
//     // Send the cropped image to the server.
//     // This is a placeholder example; replace it with your actual API call.
//     // Assume that the server responds with a file path.
//     const filePath = 'path/to/uploaded/image.jpg';

//     // Emit the file path back to the parent component
//     emits.imagePath(filePath);

//     // Reset the cropped image for future use
//     croppedImage.value = null;

//     // Close the dialog
//     dialogVisible.value = false;
//   }
// };
// const uploadToAPI = () => {
//   const form = new FormData();
//   // localData.userProfile.profilephoto != previewImage.value
//   //   ? form.append('profilephoto', localData.userProfile.profilephoto)
//   //   : null;

//   form.append('username', 'h');
//   form.append('profilephoto', image.value);

//   api.put(baseURL + '/user/profile/update/profilephoto/' + 2, form);
// };
const uploadToAPI = () => {
  const { canvas } = cropper.value.getResult();
  if (canvas) {
    // const form = new FormData();
    canvas.toBlob((blob) => {
      // form.append('file', blob);
      // You can use axios, superagent and other libraries instead here
      // fetch('http://example.com/upload/', {
      // 	method: 'POST',
      // 	body: form,
      // });

      const form = new FormData();
      form.append('profilephoto', blob, 'profilephoto.jpg');

      // Make your API call here to upload the blob to the server
      api
        .put(baseURL + '/user/profile/update/profilephoto/' + 2, form)
        .then((response) => {
          // Handle the response from the server
          if (response.status === 200) {
            // Successfully uploaded
            // You may want to handle this based on your API response
          } else {
            // Handle the error
          }
        })
        .catch((error) => {
          // Handle API call error
        });
      // Perhaps you should add the setting appropriate file format here
    }, 'image/jpeg');
  }
};
</script>
