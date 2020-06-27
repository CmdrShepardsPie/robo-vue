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
        v-for="square in row"
        :key="square.id"
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
          @mouseleave="setHover($event, robot)"
          @mouseenter="setHover($event, robot)"
        >
          {{ robot.name }}
        </div>
        <div
          v-if="
            square.robots.length === 0 &&
              findGhosts({ square: square.id }).length > 0
          "
          :class="[
            'grid-view__robot',
            'grid-view__robot-ghost',
            {
              'hover-bot':
                (selectedRobot &&
                  findGhosts({ square: square.id }).find(
                    ghost => ghost.robot === selectedRobot.id
                  )) ||
                (hoveredRobot &&
                  findGhosts({ square: square.id }).find(
                    ghost => ghost.robot === hoveredRobot.id
                  )),
              'warning-path':
                selectedRobot &&
                findGhosts({ square: square.id }).find(
                  ghost => ghost.robot !== selectedRobot.id
                ),
              'other-path':
                !selectedRobot &&
                hoveredRobot &&
                findGhosts({ robot: hoveredRobot.id }).findIndex(
                  ghost => ghost.square === square.id
                ) === -1
            }
          ]"
          :style="[
            {
              'animation-delay': `${
                hoveredRobot
                  ? findGhosts({ robot: hoveredRobot.id }).findIndex(
                      ghost => ghost.square === square.id
                    )
                  : 0
              }00ms`
            }
          ]"
        ></div>
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
  grid: Grid = new Grid(12, 22);
  ghosts: { square: string; robot: string }[] = [];

  selectedRobot: Robot | null = null;
  selectedSquare: Square | null = null;
  enteredSquare: Square | null = null;
  leftSquare: Square | null = null;
  hoveredRobot: Robot | null = null;

  created() {
    // this.grid.moveRobotToSquare(new Robot('BoB'), this.grid.squareRows[0][0]);
    // this.grid.moveRobotToSquare(new Robot('BiB'), this.grid.squareRows[0][1]);
    let id = 0;
    for (let row = 2; row < 11; row += 3) {
      for (let column = 2; column < 20; column++) {
        this.grid.moveRobotToSquare(
          new Robot(id.toString()),
          this.grid.squareRows[row][column]
        );
        id++;
        this.grid.moveRobotToSquare(
          new Robot(id.toString()),
          this.grid.squareRows[row + 1][column]
        );
        id++;
      }
    }
  }

  findGhosts({
    square,
    robot,
    and
  }: {
    square?: string;
    robot?: string;
    and?: boolean;
  }) {
    return this.ghosts.filter(ghost =>
      and
        ? square === ghost.square && robot === ghost.robot
        : square === ghost.square || robot === ghost.robot
    );
  }

  selectRobot(event: MouseEvent, robot: Robot) {
    if (event.type === 'mousedown') {
      if (this.selectedRobot === robot) {
        this.selectedRobot = null;
      } else {
        this.selectedRobot = robot;
      }
    }
    if (event.type === 'mouseup' && robot !== this.selectedRobot) {
      this.selectedRobot = null;
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
      if (
        this.selectedRobot &&
        this.findGhosts({
          square: square.id,
          robot: this.selectedRobot.id,
          and: true
        }).length === 0
      ) {
        this.ghosts.push({ square: square.id, robot: this.selectedRobot.id });
      }
    }
  }

  setHover(event: MouseEvent, robot: Robot) {
    if (event.type === 'mouseenter') {
      this.hoveredRobot = robot;
    } else if (event.type === 'mouseleave') {
      console.log(event.type);
      this.hoveredRobot = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-view {
  user-select: none;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: #999 0 0 2px;

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
    background-color: #ccc;
    box-shadow: #aaa inset 0 0 2px;
    &:not(.has-robot) {
      &:hover {
        background-color: #ddd;
      }
      &.selected-square,
      &.hover-square {
        background-color: #efe;
      }
    }
  }
  @keyframes glow {
    0% {
      background-color: #eee;
    }
    50% {
      background-color: #ddd;
    }
    100% {
      background-color: #ddd;
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
    background-color: #eee;
    margin: 6px;
    border-radius: 5px;
    box-shadow: #aaa 0 0 2px;
    &-ghost {
      background-color: transparent;
      animation-fill-mode: both;
      &.hover-bot {
        background-color: #ddd;
        animation: 2s ease-out 0s infinite normal glow;
      }
      &.warning-path {
        background-color: #ffe;
      }
      &.other-path {
        background-color: #bbb;
      }
    }
    &:hover {
      background-color: #fff;
    }
    &.selected-robot {
      background-color: #efe;
    }
    &.invalid-target {
      background-color: #fee;
    }
  }
}
</style>
