<template>
  <q-page>
    <div v-if="loading">
      <StepLoader />
    </div>
    <div v-else class="q-gutter-sm">
      <div class="container">
        <q-btn
          v-if="userStore.getUsername == localData.data.author"
          label="Edit"
          outline
          class="q-mt-md text-weight-bold"
          @click="
            router.push({
              name: 'DraftPost',
              params: {
                id: localData.data.id,
              },
            })
          "
        />

        <p
          class="q-py-md q-my-md"
          :class="
            $q.width >= 768
              ? 'text-h2 text-weight-bold'
              : 'text-h3 text-weight-bold'
          "
          style="word-break: normal"
        >
          <b>{{ localData.data.title }}</b>
        </p>

        <div class="row">
          <div
            class="row cursor-pointer"
            @click="
              router.push({
                name: 'UserPage',
                params: { user: localData.data.author },
              })
            "
          >
            <q-avatar>
              <q-img :src="authorPhotoLink(localData.data.authorphoto)" />
            </q-avatar>
            <q-space />
            <div class="q-pl-md column">
              <span class="text-weight-bold">@{{ localData.data.author }}</span>
              <p class="text-grey-7">
                {{ formatDate(localData.data.date) }}
              </p>
            </div>
          </div>
          <q-space />

          <div class="column">
            <!-- <q-icon name="print" color="teal" size="2em" />
         -->
            <BookmarkButton
              :post-data="localData.selectedData"
            ></BookmarkButton>
            <!-- <q-icon name="today" class="text-orange" size="2em" /> -->
          </div>
        </div>
      </div>
      <q-img
        height="auto"
        width="100vw"
        style="max-width: 100vw"
        :src="localData.data.coverimage"
      />
      <div class="container">
        <ShareButton :slug="localData.data.slug" />
      </div>

      <!-- <QuillEditor :options="options" ref="q" style="border: 0px solid white" /> -->
      <div class="quill-container container">
        <div ref="q"></div>
      </div>
      <!-- <q-card flat bordered>
      <q-card-section> {{ q }} </q-card-section>
    </q-card> -->
      <!--
    <q-card flat bordered>
      <q-card-section :v-html="q" />
    </q-card>  -->

      <div class="container">
        <div class="row items-center">
          <b>Category: </b>
          <q-chip
            square
            color="black"
            text-color="white"
            clickable
            @click="gotToCategories(localData.data.category)"
          >
            {{ localData.data.category }}
          </q-chip>
        </div>

        <div class="row q-pb-md">
          <div v-for="tag in localData.data.tags" :key="tag">
            <q-chip
              square
              color="grey-100"
              text-color="grey-500"
              label="#"
              clickable
              @click="gotToTags(tag)"
            >
              {{ tag }}
            </q-chip>
          </div>
        </div>
        <div>
          <div v-if="canLoadAds">
            <FaknaBanner
              :faknaData="localData.faknaData"
              v-if="localData.faknaData"
            />
          </div>
        </div>

        <q-separator />
        <h4>Related</h4>
        <div class="q-gutter-md flex justify-center">
          <div
            v-if="loading"
            :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
          >
            <SkeletonPostCard />
          </div>
          <div
            v-else
            :class="$q.screen.width >= 100 ? 'col-12 ' : 'col-3'"
            v-for="post in localData.related"
            :key="post"
          >
            <post-card
              :cover-image="post.coverimage"
              :title="post.title"
              :author="post.author"
              :authorimage="post.authorphoto"
              :post-date="post.date"
              :slug="post.slug"
            ></post-card>
          </div>
          <div v-if="localData.related == ''">No Related Posts</div>
          <!-- Pagination -->

          <!-- {{ pagination }} -->
        </div>
        <div>
          <CommentList v-if="localData.data.id" :postId="localData.data.id" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Quill from 'quill';

import { ref, onMounted, reactive, computed, watch } from 'vue';
// import { QuillEditor } from '@vueup/vue-quill';
// import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { mediaPath } from 'src/boot/axios';
import { useMeta } from 'quasar';

import { api } from 'src/boot/axios';
import PostCard from 'components/PostCard.vue';
import SkeletonPostCard from 'src/components/SkeletonPostCard.vue';
import CommentList from 'components/Comments/CommentList.vue';
import BookmarkButton from 'src/components/Actions/BookmarkButton.vue';
import { formatDate, authorPhotoLink } from 'src/boot/helpers';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
const userStore = useUserStore();
import { useQuasar } from 'quasar';
import StepLoader from 'src/components/StepLoader.vue';
import ShareButton from 'src/components/Actions/ShareButton.vue';
import FaknaBanner from 'src/components/Fakna/FaknaBanner.vue';

const metaData = {
  // sets document title
  title: '',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title) => `${title}-${localData.data.author}`,

  // meta tags
  meta: {
    description: { name: '', content: '' },
    keywords: { name: '', content: '' },
    equiv: {
      'http-equiv': 'Content-Type',
      content: 'text/html; charset=UTF-8',
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle) {
        return `${ogTitle}-${localData.data.author}`;
      },
    },
  },

  // CSS tags
  link: {
    material: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    },
  },

  // JS tags
  script: {
    ldJson: {
      type: 'application/ld+json',
      innerHTML: '{ "@context": "http://schema.org" }',
    },
  },

  // <html> attributes
  htmlAttr: {
    'xmlns:cc': 'http://creativecommons.org/ns#', // generates <html xmlns:cc="http://creativecommons.org/ns#">,
    empty: undefined, // generates <html empty>
  },

  // <body> attributes
  bodyAttr: {
    'action-scope': 'xyz', // generates <body action-scope="xyz">
    empty: undefined, // generates <body empty>
  },

  // <noscript> tags
  noscript: {
    default: 'This is content for browsers with no JS (or disabled JS)',
  },
};

// var Delta = new Quill.import('delta');
const $q = useQuasar();
let quill = '';

const route = useRoute();
const router = useRouter();

const q = ref('mizomade');
const loading = ref(true);
const canLoadAds = ref(true);

const ready = ref(false);

const localData = reactive({
  data: {},
  related: {},
  selectedData: {},
  faknaData: {},
});
const options = reactive({
  // debug: 'info',
  modules: {
    toolbar: null,
  },
  placeholder: 'Mizomade',
  readOnly: true,
  theme: 'snow',
});
// const options: {

//       };

onMounted(async () => {
  quill = new Quill(q.value, options);

  // Watch for changes in the route parameter and reload data
  watch(
    () => route.params.slug,
    async (newSlug) => {
      loading.value = true; // Set loading to true when new data is requested

      await loadPostData(newSlug);
    }
  );
  await loadPostData();
  try {
    await loadfaknaData();
  } catch {
    console.log('ERROR');
  }
});

const loadfaknaData = async () => {
  try {
    const response = await api.get('/fakna/get-fakna/?fakna_type=Banner');
    localData.faknaData = response.data[0];
    canLoadAds.value = true;
  } catch (error) {
    console.error('ADS fetching data:', error);
    canLoadAds.value = false;
  }
};

const loadPostData = async (slug = route.params.slug) => {
  try {
    const response = await api.get('/posts/' + slug);
    const postData = response.data.post;

    const deltaFormat = postData.content;
    const formattedContents = JSON.parse(deltaFormat);

    // Initialize Quill with a delay to ensure DOM readiness

    setTimeout(() => {
      quill = new Quill(q.value, options);

      // Check if Quill is enabled before setting contents

      quill.setContents(formattedContents);
    }, 1000); // You can adjust the delay duration (e.g., 100 milliseconds) as needed

    localData.data = postData;
    localData.related = response.data.related;

    // Set loading to false when data is successfully loaded
    loading.value = false;
    updateMeta();

    selectData();
  } catch (error) {
    console.error('Error fetching data:', error);
    // Set loading to false even in case of an error
    loading.value = false;
  }
};
const updateMeta = () => {
  metaData.title = localData.data.title;
  metaData.meta.keywords.name = localData.data.title;
  metaData.meta.keywords.content = localData.data.tags;
  metaData.bodyAttr = localData.data.content;

  useMeta(metaData);
};
const gotToTags = (tag) => {
  router.push({ name: 'TagPage', params: { tag: tag } });
};

const gotToCategories = (category) => {
  router.push({ name: 'CategoryPage', params: { category: category } });
};

const selectData = () => {
  localData.selectedData.author = localData.data.author;
  localData.selectedData.authorphoto = localData.data.authorphoto;
  localData.selectedData.coverimage = localData.data.coverimage;
  localData.selectedData.date = localData.data.date;
  localData.selectedData.slug = localData.data.slug;
  localData.selectedData.title = localData.data.title;
  localData.selectedData.postId = localData.data.id;
  localData.selectedData.published = localData.data.published;
};

// watch(localData.data, async (newId) => {
//   ready.value = true;
//   localData.data = newId;
// });
</script>

<style scoped>
.ql-editor {
  border: 0px solid red;
}
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

.ql-container {
  border: none;
}

.ql-snow {
  box-sizing: border-box;
}

.quill-container ::v-deep img {
  width: 100%;
  /* margin-right: 16%; */
}

@media (max-width: 768px) {
  .quill-container ::v-deep img {
    /* Margin for smaller screens (2% on each side) */
    max-width: 90vw;
    height: auto;

    margin-left: 2%;
    margin-right: 2%;
  }
}
</style>
