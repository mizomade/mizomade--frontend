<template>
  <div class="flex column justify-center items-center q-mt-md">
    <div class="loader mx-auto q-mt-xl">
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__ball"></div>
    </div>
    <div class="animate-pulse mt-6 mb-32">loading...</div>
  </div>
</template>

<style scoped>
html {
  height: 100%;
}

body {
  height: 100%;
  background: #ea4961;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  position: relative;
  width: 75px;
  height: 100px;
}
.loader__bar {
  position: absolute;
  bottom: 0;
  width: 10px;
  height: 50%;
  background: #111827;
  transform-origin: center bottom;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
}
.loader__bar:nth-child(1) {
  left: 0;
  transform: scale(1, 0.2);
  -webkit-animation: barup1 4s infinite;
  animation: barup1 4s infinite;
}
.loader__bar:nth-child(2) {
  left: 15px;
  transform: scale(1, 0.4);
  -webkit-animation: barup2 4s infinite;
  animation: barup2 4s infinite;
}
.loader__bar:nth-child(3) {
  left: 30px;
  transform: scale(1, 0.6);
  -webkit-animation: barup3 4s infinite;
  animation: barup3 4s infinite;
}
.loader__bar:nth-child(4) {
  left: 45px;
  transform: scale(1, 0.8);
  -webkit-animation: barup4 4s infinite;
  animation: barup4 4s infinite;
}
.loader__bar:nth-child(5) {
  left: 60px;
  transform: scale(1, 1);
  -webkit-animation: barup5 4s infinite;
  animation: barup5 4s infinite;
}
.loader__ball {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 10px;
  height: 10px;
  background: #111827;
  border-radius: 50%;
  -webkit-animation: ball 4s infinite;
  animation: ball 4s infinite;
}

@-webkit-keyframes ball {
  0% {
    transform: translate(0, 0);
  }
  5% {
    transform: translate(8px, -14px);
  }
  10% {
    transform: translate(15px, -10px);
  }
  17% {
    transform: translate(23px, -24px);
  }
  20% {
    transform: translate(30px, -20px);
  }
  27% {
    transform: translate(38px, -34px);
  }
  30% {
    transform: translate(45px, -30px);
  }
  37% {
    transform: translate(53px, -44px);
  }
  40% {
    transform: translate(60px, -40px);
  }
  50% {
    transform: translate(60px, 0);
  }
  57% {
    transform: translate(53px, -14px);
  }
  60% {
    transform: translate(45px, -10px);
  }
  67% {
    transform: translate(37px, -24px);
  }
  70% {
    transform: translate(30px, -20px);
  }
  77% {
    transform: translate(22px, -34px);
  }
  80% {
    transform: translate(15px, -30px);
  }
  87% {
    transform: translate(7px, -44px);
  }
  90% {
    transform: translate(0, -40px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes ball {
  0% {
    transform: translate(0, 0);
  }
  5% {
    transform: translate(8px, -14px);
  }
  10% {
    transform: translate(15px, -10px);
  }
  17% {
    transform: translate(23px, -24px);
  }
  20% {
    transform: translate(30px, -20px);
  }
  27% {
    transform: translate(38px, -34px);
  }
  30% {
    transform: translate(45px, -30px);
  }
  37% {
    transform: translate(53px, -44px);
  }
  40% {
    transform: translate(60px, -40px);
  }
  50% {
    transform: translate(60px, 0);
  }
  57% {
    transform: translate(53px, -14px);
  }
  60% {
    transform: translate(45px, -10px);
  }
  67% {
    transform: translate(37px, -24px);
  }
  70% {
    transform: translate(30px, -20px);
  }
  77% {
    transform: translate(22px, -34px);
  }
  80% {
    transform: translate(15px, -30px);
  }
  87% {
    transform: translate(7px, -44px);
  }
  90% {
    transform: translate(0, -40px);
  }
  100% {
    transform: translate(0, 0);
  }
}
@-webkit-keyframes barup1 {
  0% {
    transform: scale(1, 0.2);
  }
  40% {
    transform: scale(1, 0.2);
  }
  50% {
    transform: scale(1, 1);
  }
  90% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 0.2);
  }
}
@keyframes barup1 {
  0% {
    transform: scale(1, 0.2);
  }
  40% {
    transform: scale(1, 0.2);
  }
  50% {
    transform: scale(1, 1);
  }
  90% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 0.2);
  }
}
@-webkit-keyframes barup2 {
  0% {
    transform: scale(1, 0.4);
  }
  40% {
    transform: scale(1, 0.4);
  }
  50% {
    transform: scale(1, 0.8);
  }
  90% {
    transform: scale(1, 0.8);
  }
  100% {
    transform: scale(1, 0.4);
  }
}
@keyframes barup2 {
  0% {
    transform: scale(1, 0.4);
  }
  40% {
    transform: scale(1, 0.4);
  }
  50% {
    transform: scale(1, 0.8);
  }
  90% {
    transform: scale(1, 0.8);
  }
  100% {
    transform: scale(1, 0.4);
  }
}
@-webkit-keyframes barup3 {
  0% {
    transform: scale(1, 0.6);
  }
  100% {
    transform: scale(1, 0.6);
  }
}
@keyframes barup3 {
  0% {
    transform: scale(1, 0.6);
  }
  100% {
    transform: scale(1, 0.6);
  }
}
@-webkit-keyframes barup4 {
  0% {
    transform: scale(1, 0.8);
  }
  40% {
    transform: scale(1, 0.8);
  }
  50% {
    transform: scale(1, 0.4);
  }
  90% {
    transform: scale(1, 0.4);
  }
  100% {
    transform: scale(1, 0.8);
  }
}
@keyframes barup4 {
  0% {
    transform: scale(1, 0.8);
  }
  40% {
    transform: scale(1, 0.8);
  }
  50% {
    transform: scale(1, 0.4);
  }
  90% {
    transform: scale(1, 0.4);
  }
  100% {
    transform: scale(1, 0.8);
  }
}
@-webkit-keyframes barup5 {
  0% {
    transform: scale(1, 1);
  }
  40% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 0.2);
  }
  90% {
    transform: scale(1, 0.2);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes barup5 {
  0% {
    transform: scale(1, 1);
  }
  40% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 0.2);
  }
  90% {
    transform: scale(1, 0.2);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
