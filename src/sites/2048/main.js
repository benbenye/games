import vConsole from 'vconsole';
import 'amfe-flexible';
import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

new vConsole();
new Vue({
  render: h => h(App)
}).$mount('#app');
