<template>
  <div class="q-pa-md">
    <q-card class="mycard">
      <q-skeleton height="200px" square />
      <q-skeleton height="5px" type="rect" class="q-pa-md q-ma-md" />

      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>
      <!--
      <q-card-actions align="right" class="q-gutter-md">
        <q-skeleton type="QBtn" />
        <q-skeleton type="QBtn" />
      </q-card-actions> -->
    </q-card>
  </div>
</template>

<style>
.mycard {
  width: 280px;
  height: 400px;
}
</style>
