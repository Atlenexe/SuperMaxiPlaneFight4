import { FSprite } from '@fibbojs/2d'
import type { FComponentOptions, FScene } from '@fibbojs/2d'

export default class Enemy extends FSprite {

  life: number = 2
  speed: number = 1

  constructor(scene: FScene, options: FComponentOptions) {
    super(scene, {
      texture: 'enemy.png',
      position: options.position,
      scale: { x: 2.2, y: 2.2 },
    })
  }

  onFrame(delta: number): void {
    this.position.x -= this.speed * delta
    super.onFrame(delta)
    this.sensor?.rigidBody.setTranslation({ x: this.position.x, y: this.position.y }, true)
  }
}
