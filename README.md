# Slot Machine Simulation

This is simply a slot machine simulation.

## Getting Started

You can simply fork the repo [here](https://github.com/ucanfil/slotMachine) to your system and style as you wish.

### Prerequisities

You just need a google chrome browser to check this simulation out.

### Installing

> You can play the game online [here.](https://ucanfil.github.io/slotMachine/)

## Playing Instructions

  * Click big green SPIN button and wait for reels to land :)

## Features

  * Each reel has a spinning kind if animation in 3d.
  * There are horizontal win-lines on visible part of reel: top, center, bottom. A reel can stop only in these fixed positions. A stopped reel has either:
    - a symbol on center win-line
    - symbols on top and bottom win-lines
  * On the left part of the screen resides the pay-table. Which indicates the winning amounts.
  * When a particular win happens, corresponding row/s and win-lines are getting highlighted.
  * At the very last row of pay-table, the total balance locates. Users can specify a balance within 0-5000. In case of an invalid input, there is a warning text appears below part of the page.
  * Under the reels users will see "game mode" area. From there, positions and symbols can be set as wished.
  * Simulation has spin and payoff sounds. Make sure your sound is on.
  * Animation speed can be adjusted among three levels: slow, normal and fast.


## Built With

  * Used jQuery and therefore JavaScript ES5. ES6 has some advantages over its older brother but because of the ease of animations comes with jQuery, I picked ES5 to play nicely with it.
  * Html5
  * Css3 (flexbox, transforms)

## Authors

  - Burak Tilek - [ucanfil](https://github.com/ucanfil)

## Acknowledgements

  * [Consistent frame per second logic is from](https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe)
---