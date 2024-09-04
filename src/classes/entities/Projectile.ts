import { FSprite } from '@fibbojs/2d'
import type { FComponentOptions, FScene } from '@fibbojs/2d'

export default class Projectile extends FSprite {

  speed: number = 12

  constructor(scene: FScene, options: FComponentOptions ) {
    super(scene, {
      texture: 'fire.png',
      position: options.position,
      scale: { x: .8, y: .8 },
    })
  }

  onFrame(delta: number): void {
    this.position.x += this.speed * delta
    super.onFrame(delta)
  }
}
