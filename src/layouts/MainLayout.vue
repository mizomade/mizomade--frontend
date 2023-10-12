<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white" v-if="$q.screen.lg || $q.screen.md">
      <q-toolbar>
        <!-- <q-btn flat round dense icon="menu" class="q-mr-sm" /> -->
        <div
          class="row items-end q-ml-lg cursor-pointer"
          @click="router.push('/')"
        >
          <img src="~/assets/m.svg" alt="Logo" style="height: 30px" />
          <span
            class="text-black text-weight-bold q-pl-xs"
            style="font-size: 16px"
            >Mizomade.com</span
          >
        </div>
        <q-space />

        <q-input
          dense
          outlined
          v-model="query"
          placeholder="Search..."
          class="q-mr-md"
          @click="expandSearch"
          :expand="searchExpanded"
          @keyup.enter="goToSearch(query)"
        />
        <q-space></q-space>
        <!-- <q-btn flat round dense icon="search" class="q-mr-xs" /> -->

        <q-item clickable v-for="category in categories" :key="category.id">
          <q-item-section>
            <q-item-label
              class="text-black text-weight-bold"
              @click="goToCategory(category.name)"
              >{{ category.name }}</q-item-label
            >
          </q-item-section>
        </q-item>

        <div v-if="isAuthenticated" class="row">
          <q-btn
            label="Create"
            color="black"
            class="text-weight-bold q-mx-xs"
            @click="create"
          />
          <div class="q-gutter-md">
            <q-avatar>
              <img :src="localData.userProfile.profilephoto" alt="User" />
            </q-avatar>

            <q-menu anchor="bottom right">
              <q-list>
                <q-item clickable @click="goToProfile">My Profile</q-item>
                <q-item clickable @click="goToDashboard">Dashboard</q-item>
                <q-item clickable @click="goToSettings">Settings</q-item>
                <q-item clickable @click="userStore.logout">Logout</q-item>
              </q-list>
            </q-menu>
          </div>
        </div>

        <q-btn
          v-else
          @click="login"
          class="text-weight-bold"
          color="black"
          label="LOGIN"
        />
      </q-toolbar>

      <!-- <q-toolbar inset>
        <q-toolbar-title> <strong>Quasar</strong> Framework </q-toolbar-title>
      </q-toolbar> -->
    </q-header>

    <!-- Mobile Navigation (Drawer) -->
    <q-header v-else elevated class="bg-white">
      <q-drawer left v-model="leftDrawerOpen" class="text-black" color="black">
        <q-list class="q-ml-md">
          <q-item class="text-weight-bold q-my-md" style="font-size: 20px">
            Mizomade.com
          </q-item>
          <q-separator></q-separator>
          <q-item clickable v-for="category in categories" :key="category.id">
            <q-item-section>
              <q-item-label
                class="text-black text-weight-bold"
                @click="goToCategory(category.name)"
                >{{ category.name }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          color="black"
        />

        <!-- <q-btn flat round dense icon="menu" class="q-mr-sm" /> -->

        <img
          src="~/assets/m.svg"
          alt="Logo"
          style="height: 30px"
          class="q-mr-xs cursor-pointer"
          @click="router.push('/')"
        />
        <!-- <p>Mizomade.com</p> -->

        <q-input
          dense
          outlined
          v-model="query"
          placeholder="Search..."
          class="q-mr-xs"
          @click="expandSearch"
          :expand="searchExpanded"
          @keyup.enter="goToSearch(query)"
          style="width: 40%"
        />
        <q-space />
        <!-- <q-btn flat round dense icon="search" class="q-mr-xs" /> -->
        <div v-if="isAuthenticated" class="row">
          <q-btn
            label="Create"
            class="text-weight-bold q-mx-xs"
            color="black"
            @click="create"
          />

          <div class="q-gutter-md">
            <q-avatar size="42px">
              <img
                :src="localData.userProfile.profilephoto"
                alt="User"
                height="40px"
                width="40px"
              />
            </q-avatar>
            <q-menu anchor="bottom right">
              <q-list>
                <q-item clickable @click="goToProfile">My Profile</q-item>
                <q-item clickable @click="goToDashboard">Dashboard</q-item>
                <q-item clickable @click="goToSettings">Settings</q-item>
                <q-item clickable @click="userStore.logout">Logout</q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
        <q-btn
          v-else
          @click="login"
          class="text-weight-bold"
          color="black"
          label="LOGIN"
        />
      </q-toolbar>
    </q-header>

    <!-- Main Content -->

    <q-page-container>
      <router-view />
    </q-page-container>
    <FooterComponent class="FooterComponents" />
  </q-layout>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';

import { api } from 'src/boot/axios';
import axios from 'axios';
import FooterComponent from 'components/FooterComponent.vue';
import { useUserStore } from 'src/stores/user-store';
import { useRoute, useRouter } from 'vue-router';

import { useQuasar } from 'quasar';
const $q = useQuasar();

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const searchExpanded = ref(false);
const showCategories = ref(false);

const loading = ref(true);
const dense = ref(true);
const previewImage = ref('');
const previewCoverImage = ref('');
const query = ref('');

watch(query, (newQuery) => {
  // Trigger the search function whenever the query changes
  goToSearch(newQuery);
});
const authorization = computed(() => {
  return userStore.getAuthorization;
});

const isAuthenticated = computed(() => {
  return userStore.isAuthenticated;
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

const categories = computed(() => {
  return userStore.categories;
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const expandSearch = () => {
  searchExpanded.value = !searchExpanded.value;
};

const toggleCategories = () => {
  showCategories.value = !showCategories.value;
};

const goToProfile = () => {
  // Implement your navigation logic for "My Profile"
  router.push({
    name: 'UserPage',
    params: { user: localData.userData.username },
  });
};

const goToCategory = (cat) => {
  // Implement your navigation logic for "My Profile"
  router.push({ name: 'CategoryPage', params: { category: cat } });
};

const goToSearch = (query) => {
  // Implement your navigation logic for "My Profile"
  router.push({ name: 'SearchPage', params: { q: query } });
};

const goToDashboard = () => {
  // Implement your navigation logic for "Dashboard"
  router.push({ name: 'Dashboard' });
};

const goToSettings = () => {
  // Implement your navigation logic for "Settings"
  router.push('/account/settings');
};
const create = () => {
  // Implement your navigation logic for "Settings"
  router.push('/account/create');
};

const login = () => {
  // Implement your logout logic
  router.push('/login');
};
</script>

<style>
.FooterComponents {
  position: sticky;
  bottom: 0;
  background-color: rgb(0, 0, 0); /* Adjust as needed */
  border-bottom: 2px solid black;
}
</style>
