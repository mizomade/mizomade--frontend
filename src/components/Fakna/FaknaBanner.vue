<template>
  <div class="q-gutter-md row items-start" v-if="showBanner">
    <q-img :src="faknaData.image_url" style="height: 200px" fit="fill">
      <div class="">
        <div class="ad-action">
          <q-icon name="close" @click="closeBanner" class="close-icon" />
        </div>
      </div>
      <div class="absolute-bottom text-subtitle1 text-center text-white">
        {{ faknaData.title }}
      </div>
      <div class="absolute-bottom text-subtitle1">
        <q-btn
          label="Learn More"
          color="white"
          class="text-black"
          @click="handleCTA"
        />
      </div>
    </q-img>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  faknaData: Object, // Define faknaData as a prop
});

const showBanner = ref(true);

const closeBanner = () => {
  showBanner.value = false;
  // console.log('CLOSE BANNER');
};

const handleCTA = () => {
  if (props.faknaData.destination_url) {
    window.open(props.faknaData.destination_url, '_blank');
  }
};
</script>

<style scoped>
.ad-banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.ad-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.ad-text {
  flex: 1;
}

.close-icon {
  cursor: pointer;
}
</style>
