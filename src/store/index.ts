import Vue from 'vue';
import Vuex from 'vuex';
import { Grid } from '@/logic/classes/grid';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});

const grid = new Grid();
grid.add({ rows: 2, columns: 2 });
