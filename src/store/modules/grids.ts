// import shop from '../../api/shop'

// initial state
const state = () => ({
  all: []
});

// getters
const getters = {};

// actions
const actions = {
  // getAllGrids ({ commit }) {
  //   shop.getGrids(grids => {
  //     commit('setGrids', grids)
  //   })
  // }
};

// mutations
const mutations = {
  // setGrids (state, grids) {
  //   state.all = grids
  // },
  //
  // decrementGridInventory (state, { id }) {
  //   const grid = state.all.find(grid => grid.id === id)
  //   grid.inventory--
  // }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
