import './style.css'
import { FFixedCamera, FScene } from '@fibbojs/2d'
import { fDebug } from '@fibbojs/devtools'
import Player from './classes/entities/Player'
import Enemy from './classes/entities/Enemy'

(async () => {
  const scene = new FScene()
  await scene.init()
  await scene.initPhysics()
  // Debug the scene
  if (import.meta.env.DEV)
    fDebug(scene)

  /**
   * Create character
   */
  const player = new Player(scene)

  const enemy = new Enemy(scene, { position: { x: 10, y: 0 } })
  enemy.initSensor()
  scene.addComponent(enemy)

  player.onCollisionWith(enemy, () => {
    console.log('CONTACT')
  })

  scene.addComponent(player)

  // Attach a camera to the character
  scene.camera = new FFixedCamera(scene, {
    position: { x: 0, y: 0 }
  })
})()
