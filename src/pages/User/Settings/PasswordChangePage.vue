<template>
  <q-page class="container">
    <div class="q-mb-md">
      <h2>Change Password</h2>
    </div>
    <q-input
      v-model="newPassword"
      outlined
      label="New Password"
      type="password"
      class="q-mb-md"
    />
    <q-input
      v-model="confirmPassword"
      outlined
      label="Confirm Password"
      type="password"
      class="q-mb-md"
    />
    <q-btn size="lg" label="Next" @click="redirectToOTPPage" color="primary" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const newPassword = ref('');
const confirmPassword = ref('');
const router = useRouter();
const userStore = useUserStore();

const redirectToOTPPage = () => {
  if (
    newPassword.value === confirmPassword.value &&
    isStrongPassword(newPassword.value)
  ) {
    userStore.setPassword(newPassword.value);
    api
      .post('/user/init_otp/', {
        phone: userStore.userPhone['phonenumber'],
        purpose: 'ChangePassword',
      })
      .then(() => {
        router.push({
          name: 'OtpSettingsPage',
          params: { purpose: 'ChangePassword' },
        });
        $q.notify({
          message: 'OTP Sent to Phone Number',
          color: 'green',
        });
      })
      .catch((error) => {
        $q.notify({
          message: 'Invalid Action',
          color: 'red',
        });
      });
  } else {
    if (!isStrongPassword(newPassword.value)) {
      $q.notify({
        message:
          'Password must be strong (e.g., at least 8 characters with a mix of letters, numbers, and symbols)',
        color: 'red',
      });
    } else {
      alert('Passwords do not match. Please try again.');
    }
  }
};

const isStrongPassword = (password) => {
  // Check if the password meets the criteria for a strong password
  // You can customize this regex pattern according to your requirements
  const strongPasswordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return strongPasswordPattern.test(password);
};
</script>
