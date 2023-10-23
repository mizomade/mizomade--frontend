<template>
  <q-card class="mycard cursor-pointer" @click="goToDetail(slug)">
    <!-- <img :src="coverImage" height="200" /> -->

    <div>
      <q-img
        :src="coverImage"
        loading="lazy"
        spinner-color="white"
        height="200px"
        style="
          max-height: 200;
          border-top-right-radius: 4%;
          border-top-left-radius: 4%;
        "
      />
      <div class="text-h6 text-weight-bold q-pa-md" style="word-break: normal">
        {{ truncate }}
      </div>
    </div>

    <q-card-section>
      <div class="row">
        <div>
          <q-avatar size="42px">
            <img :src="authorPhotoLink(props.authorimage)" alt="" srcset="" />
          </q-avatar>
        </div>

        <div class="column q-pl-md">
          <span class="text-weight-bold">{{ author }}</span>
          <p class="text-grey-7">{{ formattedDate }}</p>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date } from 'quasar';
import { useRouter } from 'vue-router';
import { authorPhotoLink } from 'src/boot/helpers';

// const route = useRoute();
const router = useRouter();

// import { mediaPath } from 'src/boot/axios';

import { defineProps, reactive, computed, ref } from 'vue';
const props = defineProps({
  title: String,
  coverImage: String,
  authorimage: String,
  author: String,
  postDate: String,
  slug: String,
});

const formattedDate = ref();

formattedDate.value = date.formatDate(props.postDate, 'DD-MMM-YYYY');

// const authorImageLink = ref();
// authorImageLink.value = mediaPath + 'static/' + props.authorimage;
const truncate = computed(() => {
  if (props.title.length > 55) {
    return props.title.substring(0, 55) + '...';
  } else return props.title;
});

// Function to navigate to the detail page using slug
const goToDetail = (slug) => {
  router.push({ name: 'PostDetail', params: { slug } });
};
</script>

<style>
.mycard {
  width: 280px;
  height: 400px;
  display: flex;
  flex-direction: column;
  border-radius: 4%;
  /* justify-content: space-between; */
}
</style>
