<template>
  <div class="grid-view" ref="gridView">
    <div class="grid-view__row" v-for="(row, r) in grid.squareRows" :key="r">
      <square-component
        v-for="square in row"
        :key="square.id"
        :square="square"
        :selectable="true"
        :selected="selectedSquare === square"
        @selected="squareSelected(square, $event)"
        @hovered="squareHovered(square, $event)"
        @dragging="squareDragging(square, $event)"
      >
        <robot-component
          v-for="robot in square.robots"
          :key="robot.id"
          :robot="robot"
          :selectable="!selectedRobot || selectedRobot === robot"
          :selected="selectedRobot === robot"
          @selected="robotSelected(robot, $event)"
          @hovered="robotHovered(robot, $event)"
          @dragging="robotDragging(robot, $event)"
        />
      </square-component>
      <!--      <div-->
      <!--        :class="[-->
      <!--          'grid-view__square',-->
      <!--          {-->
      <!--            'selected-square': square === selectedSquare,-->
      <!--            'hover-square': selectedRobot && square === enteredSquare,-->
      <!--            'has-robot': square.robots.length > 0-->
      <!--          }-->
      <!--        ]"-->
      <!--        v-for="square in row"-->
      <!--        :key="square.id"-->
      <!--        @mousedown="selectSquare($event, square)"-->
      <!--        @mouseup="selectSquare($event, square)"-->
      <!--        @mouseleave="setDragging($event, square)"-->
      <!--        @mouseenter="setDragging($event, square)"-->
      <!--      >-->

      <!--        &lt;!&ndash; Removing Ghosts as I break everything into their own components &ndash;&gt;-->
      <!--        &lt;!&ndash;        <div&ndash;&gt;-->
      <!--        &lt;!&ndash;          v-if="&ndash;&gt;-->
      <!--        &lt;!&ndash;            square.robots.length === 0 &&&ndash;&gt;-->
      <!--        &lt;!&ndash;              findGhosts({ square: square.id }).length > 0&ndash;&gt;-->
      <!--        &lt;!&ndash;          "&ndash;&gt;-->
      <!--        &lt;!&ndash;          :class="[&ndash;&gt;-->
      <!--        &lt;!&ndash;            'grid-view__robot',&ndash;&gt;-->
      <!--        &lt;!&ndash;            'grid-view__robot-ghost',&ndash;&gt;-->
      <!--        &lt;!&ndash;            {&ndash;&gt;-->
      <!--        &lt;!&ndash;              'hover-bot':&ndash;&gt;-->
      <!--        &lt;!&ndash;                (selectedRobot &&&ndash;&gt;-->
      <!--        &lt;!&ndash;                  findGhosts({ square: square.id }).find(&ndash;&gt;-->
      <!--        &lt;!&ndash;                    ghost => ghost.robot === selectedRobot.id&ndash;&gt;-->
      <!--        &lt;!&ndash;                  )) ||&ndash;&gt;-->
      <!--        &lt;!&ndash;                (hoveredRobot &&&ndash;&gt;-->
      <!--        &lt;!&ndash;                  findGhosts({ square: square.id }).find(&ndash;&gt;-->
      <!--        &lt;!&ndash;                    ghost => ghost.robot === hoveredRobot.id&ndash;&gt;-->
      <!--        &lt;!&ndash;                  )),&ndash;&gt;-->
      <!--        &lt;!&ndash;              'warning-path':&ndash;&gt;-->
      <!--        &lt;!&ndash;                selectedRobot &&&ndash;&gt;-->
      <!--        &lt;!&ndash;                findGhosts({ square: square.id }).find(&ndash;&gt;-->
      <!--        &lt;!&ndash;                  ghost => ghost.robot !== selectedRobot.id&ndash;&gt;-->
      <!--        &lt;!&ndash;                ),&ndash;&gt;-->
      <!--        &lt;!&ndash;              'other-path':&ndash;&gt;-->
      <!--        &lt;!&ndash;                !selectedRobot &&&ndash;&gt;-->
      <!--        &lt;!&ndash;                hoveredRobot &&&ndash;&gt;-->
      <!--        &lt;!&ndash;                findGhosts({ robot: hoveredRobot.id }).findIndex(&ndash;&gt;-->
      <!--        &lt;!&ndash;                  ghost => ghost.square === square.id&ndash;&gt;-->
      <!--        &lt;!&ndash;                ) === -1&ndash;&gt;-->
      <!--        &lt;!&ndash;            }&ndash;&gt;-->
      <!--        &lt;!&ndash;          ]"&ndash;&gt;-->
      <!--        &lt;!&ndash;          :style="[&ndash;&gt;-->
      <!--        &lt;!&ndash;            {&ndash;&gt;-->
      <!--        &lt;!&ndash;              'animation-delay': `${&ndash;&gt;-->
      <!--        &lt;!&ndash;                hoveredRobot&ndash;&gt;-->
      <!--        &lt;!&ndash;                  ? findGhosts({ robot: hoveredRobot.id }).findIndex(&ndash;&gt;-->
      <!--        &lt;!&ndash;                      ghost => ghost.square === square.id&ndash;&gt;-->
      <!--        &lt;!&ndash;                    )&ndash;&gt;-->
      <!--        &lt;!&ndash;                  : 0&ndash;&gt;-->
      <!--        &lt;!&ndash;              }00ms`&ndash;&gt;-->
      <!--        &lt;!&ndash;            }&ndash;&gt;-->
      <!--        &lt;!&ndash;          ]"&ndash;&gt;-->
      <!--        &lt;!&ndash;        ></div>&ndash;&gt;-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Grid } from '@/logic/classes/grid';
import { Robot } from '@/logic/classes/robot';
import { Square } from '@/logic/classes/square';
import RobotComponent from '@/components/Robot.vue';
import SquareComponent from '@/components/Square.vue';

@Component({
  name: 'grid-view-component',
  components: {
    RobotComponent,
    SquareComponent
  }
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
    // if (this.selectedRobot && this.selectedSquare) {
    //   this.grid.moveRobotToSquare(this.selectedRobot, this.selectedSquare);
    //   this.selectedRobot = null;
    //   this.selectedSquare = null;
    // }
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

  robotSelected(robot: Robot, selected: boolean) {
    console.log('robotSelected', robot, selected);
    if (selected && !this.selectedRobot) {
      this.selectedRobot = robot;
    } else if (!selected && this.selectedRobot === robot) {
      this.selectedRobot = null;
    }
    if (this.selectedRobot && this.selectedSquare) {
      this.grid.moveRobotToSquare(this.selectedRobot, this.selectedSquare);
      this.selectedRobot = null;
      this.selectedSquare = null;
    }
  }

  robotHovered(robot: Robot, selected: boolean) {
    console.log('robotHovered', robot, selected);
  }

  robotDragging(robot: Robot, selected: boolean) {
    console.log('robotDragging', robot, selected);
  }

  squareSelected(square: Square, selected: boolean) {
    console.log('squareSelected', square, selected);
    if (selected && !this.selectedSquare) {
      this.selectedSquare = square;
    } else if (!selected && this.selectedSquare === square) {
      this.selectedSquare = null;
    }
    if (this.selectedRobot && this.selectedSquare) {
      this.grid.moveRobotToSquare(this.selectedRobot, this.selectedSquare);
      this.selectedRobot = null;
      this.selectedSquare = null;
    }
  }

  squareHovered(square: Square, selected: boolean) {
    console.log('squareHovered', square, selected);
  }

  squareDragging(square: Square, selected: boolean) {
    console.log('squareDragging', square, selected);
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
}
</style>
