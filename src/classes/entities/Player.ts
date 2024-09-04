import { FSprite } from '@fibbojs/2d'
import type { FScene } from '@fibbojs/2d'
import PlayerController from '../controllers/PlayerController'

export default class Player extends FSprite {
  constructor(scene: FScene) {
    super(scene, {
      texture: 'player.png',
      position: { x: -8, y: 0 },
      scale: { x: 2.2, y: 2.2 },
    })

    // Initialize the character controller
    this.controller = new PlayerController(scene, {
      component: this,
    })
  }
}
