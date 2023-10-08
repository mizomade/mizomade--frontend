<template>
  <q-page class="container">
    <p class="text-weight-bold" style="font-size: 30px">Settings</p>
    <q-separator />
    <q-list class="q-my-md">
      <q-item
        clickable
        v-for="setting in settings"
        :key="setting.id"
        @click="redirectToSetting(setting.route)"
      >
        <q-item-section avatar>
          <q-avatar>
            <q-icon :name="setting.icon" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ setting.name }}</q-item-label>
          <q-item-label caption>{{ setting.description }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-right icon="keyboard_arrow_right" />
        </q-item-section>
      </q-item>
    </q-list>
    <q-separator />
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const settings = [
  {
    id: 1,
    name: 'Change Password',
    description: 'Change your account password',
    icon: 'lock',
    route: 'ChangePassword',
  },
  {
    id: 2,
    name: 'Change Phone Number',
    description: 'Update your registered phone number',
    icon: 'phone',
    route: 'ChangePhone',
  },
  {
    id: 3,
    name: 'Disable Account',
    description: 'Temporarily or permanently disable your account',
    icon: 'cancel',
    route: '/disable-account',
  },
];

const redirectToSetting = (routeName) => {
  // Redirect to the selected setting page
  router.push({ name: routeName });
};
</script>
