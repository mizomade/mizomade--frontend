<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
        <div class="text-grey-8">Sign in below to access your account</div>
      </q-card-section>
      <q-card-section>
        <q-input dense outlined v-model="username" label="Username"></q-input>
        <q-input
          dense
          outlined
          class="q-mt-md"
          v-model="password"
          type="password"
          label="Password"
        ></q-input>
      </q-card-section>
      <q-card-section>
        <q-btn
          style="border-radius: 8px"
          color="dark"
          rounded
          size="md"
          label="Sign in"
          no-caps
          class="full-width"
          @click="login"
        ></q-btn>
      </q-card-section>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Don't have an account yet?

          <p
            class="text-dark text-weight-bold cursor-pointer"
            style="text-decoration: none"
            @click="
              router.push({
                name: 'RegisterPage',
              })
            "
          >
            Sign up
          </p>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from 'src/stores/user-store.ts';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const router = useRouter();
const $q = useQuasar();

const userStore = useUserStore();
const isAuthenticated = computed(() => userStore.isAuthenticated);

const username = ref('');
const password = ref('');

const login = async () => {
  // Call the login action from the user store
  await userStore.login(username.value, password.value);
  if (isAuthenticated.value) {
    // $q.notify({
    //   message: 'Login Successful',
    //   // caption: '5 minutes ago',
    //   color: 'green',
    // });
    router.push('/');
  }
};
</script>

<style>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
