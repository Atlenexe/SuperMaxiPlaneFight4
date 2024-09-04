import RAPIER from '@dimforge/rapier2d'
import { FKeyboard } from '@fibbojs/event'
import { FController, FShapes } from '@fibbojs/2d'
import type { FControllerOptions, FScene } from '@fibbojs/2d'
import Projectile from '../entities/Projectile'

export interface PlayerControllerOptions extends FControllerOptions {
  /**
   * The speed of the character.
   */
  speed?: number
}

/**
 * @description Custom controller
 * @category Character
 */
export default class PlayerController extends FController {
  /**
   * The inputs that will be used to move the character.
   */
  inputs: {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
  }

  /**
   * The speed of the character.
   */
  speed: number

  /**
   * The scene where the character is.
   */
  scene: FScene

  /**
   * The character controller that will be used to move the character.
   */
  characterController: RAPIER.KinematicCharacterController

  constructor(scene: FScene, options: PlayerControllerOptions) {
    super(options)

    // Define default values
    const DEFAULT_OPTIONS = {
      speed: 1,
    }
    // Apply default options
    options = { ...DEFAULT_OPTIONS, ...options }
    // Validate options
    if (!options.speed)
      throw new Error('FibboError: FCharacter requires speed option')

    // Store options
    this.scene = scene
    this.speed = options.speed

    // Map of the movements (will be updated by the keyboard)
    this.inputs = {
      up: false,
      down: false,
      left: false,
      right: false,
    }

    // Create a keyboard instance
    const fKeyboard = new FKeyboard(scene)

    // Key down
    fKeyboard.onKeyDown('w', () => {
      this.inputs.up = true
    })
    fKeyboard.onKeyDown('s', () => {
      this.inputs.down = true
    })
    fKeyboard.onKeyDown('a', () => {
      this.inputs.left = true
    })
    fKeyboard.onKeyDown('d', () => {
      this.inputs.right = true
    })
    // For AZERTY keyboards
    fKeyboard.onKeyDown('z', () => {
      this.inputs.up = true
    })
    fKeyboard.onKeyDown('q', () => {
      this.inputs.left = true
    })

    // Key up
    fKeyboard.onKeyUp('w', () => {
      this.inputs.up = false
    })
    fKeyboard.onKeyUp('s', () => {
      this.inputs.down = false
    })
    fKeyboard.onKeyUp('a', () => {
      this.inputs.left = false
    })
    fKeyboard.onKeyUp('d', () => {
      this.inputs.right = false
    })
    // For AZERTY keyboards
    fKeyboard.onKeyUp('z', () => {
      this.inputs.up = false
    })
    fKeyboard.onKeyUp('q', () => {
      this.inputs.left = false
    })

    // Create a projectile on space key press
    let projectileCreated = false;
    fKeyboard.onKeyDown(' ', () => {
      if (projectileCreated) return
      const projectile = new Projectile(this.scene, { position: { x: this.component.x + (this.component.scaleX / 2), y: this.component.y } })
      scene.addComponent(projectile)
      projectileCreated = true
    })
    fKeyboard.onKeyUp(' ', () => {
      projectileCreated = false;
    });

    // The gap the controller will leave between the character and its environment
    const offset = 0.01
    // Create the character controller
    this.characterController = scene.world.createCharacterController(offset)

    // Initialize the rigid body
    this.component.initRigidBody({
      rigidBodyType: RAPIER.RigidBodyType.KinematicPositionBased,
      lockRotations: true,
      ...options,
    })

    // Initialize a sensor
    this.component.initSensor({
      shape: FShapes.SQUARE,
      scale: { x: 1.1, y: 1.1 },
    })
  }

  /**
   * Return the corrected movements for the current frame.
   */
  getCorrectedMovements(): { x: number, y: number } {
    const movementDirection = new RAPIER.Vector2(0, 0)
    // Compute the movement direction
    movementDirection.x = this.inputs.left ? -1 : this.inputs.right ? 1 : 0
    movementDirection.y = this.inputs.down ? -1 : this.inputs.up ? 1 : 0

    // Create movement vector
    const desiredMovement = {
      x: movementDirection.x * 8 * 0.01 * this.speed,
      y: movementDirection.y * 8 * 0.01 * this.speed,
    }
    // Compute the desired movement
    this.characterController.computeColliderMovement(
      this.component.collider?.collider as RAPIER.Collider,
      desiredMovement,
      RAPIER.QueryFilterFlags.EXCLUDE_SENSORS,
    )

    // Get the corrected movement
    return this.characterController.computedMovement()
  }

  onFrame(delta: number): void {
    // Get the corrected movement
    const correctedMovement = this.getCorrectedMovements()

    // Apply the movement to the rigid body
    this.component.rigidBody?.rigidBody.setNextKinematicTranslation({
      x: this.component.rigidBody.rigidBody.translation().x + correctedMovement.x * delta * this.speed * 64,
      y: this.component.rigidBody.rigidBody.translation().y + correctedMovement.y * delta * this.speed * 64,
    })
  }
}