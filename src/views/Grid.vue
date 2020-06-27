<template>
  <div class="grid-view">
    <div class="grid-view__row" v-for="(row, r) in grid.squareRows" :key="r">
      <div
        :class="[
          'grid-view__square',
          {
            'selected-square': square === selectedSquare,
            'hover-square': selectedRobot && square === enteredSquare,
            'has-robot': square.robots.length > 0
          }
        ]"
        v-for="(square, s) in row"
        :key="s"
        @mousedown.stop="selectSquare($event, square)"
        @mouseup.stop="selectSquare($event, square)"
        @mouseleave="setDragging($event, square)"
        @mouseenter="setDragging($event, square)"
      >
        <div
          :class="[
            'grid-view__robot',
            {
              'selected-robot': robot === selectedRobot,
              'invalid-target': selectedRobot && selectedRobot !== robot
            }
          ]"
          v-for="robot in square.robots"
          :key="robot.id"
          @mousedown.stop="selectRobot($event, robot)"
          @mouseup.stop="selectRobot($event, robot)"
        >
          {{ robot.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Grid } from '@/logic/classes/grid';
import { Robot } from '@/logic/classes/robot';
import { Square } from '@/logic/classes/square';

@Component({
  name: 'grid-view-component'
})
export default class GridViewComponent extends Vue {
  grid: Grid = new Grid(4, 4);

  selectedRobot: Robot | null = null;
  selectedSquare: Square | null = null;
  enteredSquare: Square | null = null;
  leftSquare: Square | null = null;

  created() {
    this.grid.moveRobotToSquare(new Robot('BoB'), this.grid.squareRows[0][0]);
    this.grid.moveRobotToSquare(new Robot('BiB'), this.grid.squareRows[0][1]);
  }

  selectRobot(event: MouseEvent, robot: Robot) {
    if (event.type === 'mousedown') {
      if (this.selectedRobot === robot) {
        this.selectedRobot = null;
      } else {
        this.selectedRobot = robot;
      }
    }
    if (this.selectedRobot && this.selectedSquare) {
      this.grid.moveRobotToSquare(this.selectedRobot, this.selectedSquare);
      this.selectedRobot = null;
      this.selectedSquare = null;
    }
  }

  selectSquare(event: MouseEvent, square: Square) {
    if (
      this.selectedSquare === square ||
      (!this.selectedRobot && event.type === 'mouseup')
    ) {
      this.selectedSquare = null;
    } else {
      this.selectedSquare = square;
    }
    if (this.selectedRobot && this.selectedSquare) {
      this.grid.moveRobotToSquare(this.selectedRobot, this.selectedSquare);
      this.selectedRobot = null;
      this.selectedSquare = null;
    }
  }

  setDragging(event: MouseEvent, square: Square) {
    if (event.type === 'mouseenter') {
      this.enteredSquare = square;
    } else if (event.type === 'mouseleave') {
      this.leftSquare = square;
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-view {
  user-select: none;
  display: flex;
  flex: auto;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  height: 100vh;
  div {
    transition: background 500ms;
    &:hover {
      transition: background 100ms;
    }
  }
  &__row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 5rem;
  }

  &__square {
    display: flex;
    flex-direction: row;
    width: 5rem;
    background: #ddd;
    box-shadow: #999 inset 0 0 4px;
    &:not(.has-robot) {
      &:hover {
        background: #eee;
      }
      &.selected-square,
      &.hover-square {
        background: #efe;
      }
    }
  }

  &__robot {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    justify-items: center;
    align-items: center;
    flex: 1;
    background: #ccc;
    margin: 6px;
    border-radius: 10px;
    box-shadow: #666 0 0 2px;

    &:hover {
      background: #ddd;
    }
    &.selected-robot {
      background: #efe;
    }
    &.invalid-target {
      background: #fee;
    }
  }
}
</style>
