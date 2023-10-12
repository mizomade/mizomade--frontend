<template>
  <q-page class="container q-my-md">
    <q-card class="q-pa-md" no-shadow>
      <q-card-title class="q-pa-md">
        <!-- <p class="text-h2">Posts Analytics</p> -->
        <p class="bg-grey-2 q-pa-md border-rounded">
          Post Analytics Data Disclaimer: The data presented here is based on
          post analytics and may not include other non-updated information.
          Please keep this in mind while interpreting the displayed data.
        </p>
      </q-card-title>

      <q-card-section class="q-pa-md text-weight-bold">
        <q-table
          :rows="userPosts"
          :columns="columns"
          row-key="title"
          title="Post Analytics"
          flat
        >
          <!-- <template v-slot:header="props">
            <q-tr :props="props" class="">
              <q-th key="title">Title</q-th>
              <q-th key="sessions">Sessions</q-th>
              <q-th key="pageviews">Pageviews</q-th>
              <q-th key="avg_session_duration">Avg. Session Duration</q-th>
              <q-th key="users">Users</q-th>
            </q-tr>
          </template> -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-weight-bold text-black"
                style="font-size: 16px"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="title">{{ props.row.title }}</q-td>
              <q-td key="sessions" :class="getColorClass(props.row.sessions)">
                {{ props.row.sessions }}
              </q-td>
              <q-td key="pageviews" :class="getColorClass(props.row.pageviews)">
                {{ props.row.pageviews }}
              </q-td>
              <q-td key="avg_session_duration">
                {{ props.row.avg_session_duration || 'N/A' }}
              </q-td>
              <q-td key="users" :class="getColorClass(props.row.users)">
                {{ props.row.users }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { api } from 'src/boot/axios';
const userPosts = ref([]);
const columns = [
  {
    name: 'title',
    required: true,
    label: 'Title',
    align: 'left',
    field: 'title',
    sortable: true,
  },
  {
    name: 'sessions',
    required: true,
    label: 'Sessions',
    align: 'left',
    field: 'sessions',
    sortable: true,
  },
  {
    name: 'pageviews',
    required: true,
    label: 'Pageviews',
    align: 'left',
    field: 'pageviews',
    sortable: true,
  },
  {
    name: 'avg_session_duration',
    required: true,
    label: 'Avg. Session Duration',
    align: 'left',
    field: 'avg_session_duration',
    sortable: true,
  },
  {
    name: 'users',
    required: true,
    label: 'Users',
    align: 'left',
    field: 'users',
  },
];

const getColorClass = (value) => {
  if (value >= 100) {
    return 'text-positive';
  } else if (value >= 50) {
    return 'text-warning';
  } else {
    return 'text-negative';
  }
};

const fetchData = async () => {
  try {
    await api.get('/user/profile/post-analytics/').then((response) => {
      userPosts.value = response.data.user_posts_with_analytics;
    });
    // const data = await response.json();

    // userPosts.value = data.user_posts_with_analytics;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Customize the table styles here */
.text-positive {
  color: green;
}

.text-warning {
  color: orange;
}

.text-negative {
  color: red;
}
</style>
