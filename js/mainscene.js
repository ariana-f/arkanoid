import {Paddle} from './paddle.js'
import {Ball} from './ball.js'
import {Brick} from './brick.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    init() {
        this.board = {
            width: 10,
            height: 10,
            tile_size: {
                width: 64,
                height: 32
            },
            head_space: 2
        }

        this.brick_count = 0;
    }

    create() {

        this.bricks = this.physics.add.staticGroup();

        this.createMap();
        
        this.paddle = new Paddle(
            this,
            this.game.config.width * 0.5,
            this.game.config.height - 20,
            'paddle'
        );

        this.ball = new Ball(
            this,
            this.game.config.width * 0.5,
            this.game.config.height - 20,
            'ball'
        );

        this.paddle.setBall(this.ball);
    }

    update(time) {
        this.paddle.update(time);
    }

    createMap() {
        let start_x =
            (this.game.config.width * 0.5) -
            (this.board.width * this.board.tile_size.width) * 0.5;
        let start_y =
            this.board.tile_size.height * this.board.head_space;
        
        let textures = ['el_yellow', 'el_blue', 'el_green', 'el_purple', 'el_red'];
        for(let w = 0; w < this.board.width; ++w) {
            for(let h = 0; h < this.board.height; ++h) {
                let hit_count = Phaser.Math.Between(1, 5)
                
                let brick = new Brick(this,
                    start_x + w * this.board.tile_size.width,
                    start_y + h * this.board.tile_size.height,
                    textures[hit_count-1], hit_count);
                this.bricks.add(brick);
                this.brick_count = this.brick_count + 1;
            }
        }
    }

    launchBall() {
        this.ball.launch();
        this.physics.add.collider(this.paddle, this.ball);
        this.physics.add.collider(this.ball, this.bricks, this.onCollision, null, this);
    }

    onCollision(ball, brick) {
        brick.hit();
    }

    decreaseBrickCount() {
        this.brick_count--;
        if(this.brick_count <= 0) {
            this.scene.restart();
        }
    }
}