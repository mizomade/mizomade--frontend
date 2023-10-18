<template>
  <div id="app">
    <div class="upload-example">
      <cropper ref="cropper" class="upload-example-cropper" :src="image.src" />
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
        <button class="button" @click="crop">Crop image</button>
        <button class="button" @click="uploadImage">Upload image</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { Cropper } from 'vue-advanced-cropper';

const image = ref({
  src: null,
  type: null,
});

const getMimeType = (file, fallback = null) => {
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
};

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
  }
};

const crop = () => {
  const { canvas } = $refs.cropper.getResult();
  canvas.toBlob((blob) => {
    image.value.src = URL.createObjectURL(blob);
    image.value.type = 'image/jpeg'; // Assuming a fixed type for cropped images
  }, image.value.type);
};

const uploadImage = () => {
  const { src, type } = image.value;
  if (src) {
    const canvas = $refs.cropper.getResult().canvas;
    if (canvas) {
      const form = new FormData();
      canvas.toBlob((blob) => {
        form.append('file', blob);
        fetch('YOUR_UPLOAD_API_ENDPOINT', {
          method: 'POST',
          body: form,
        })
          .then(() => {
            console.log('Image uploaded successfully.');
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
          });
      }, type);
    }
  }
};

onBeforeUnmount(() => {
  if (image.value.src) {
    URL.revokeObjectURL(image.value.src);
  }
});
</script>

<style>
/* Add your CSS styles here */
</style>
