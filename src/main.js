import 'phaser';
import BootScene from './BootScene';
import MarioBrosScene from './MarioBrosScene';
import TitleScene from './TitleScene';
import GameScene from './GameScene';

let config = {
    type: Phaser.CANVAS, // Force CANVAS otherwise the map won't load? Bug in WebGL?
    parent: 'content',
    width: 400,
    // height: 240,
    height: 15*32,
    scaleMode: 0, //Phaser.ScaleManager.EXACT_FIT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [
        BootScene,
        GameScene,
        TitleScene,
        MarioBrosScene,
    ]
};

let game = new Phaser.Game(config);

/*
https://codepen.io/samme/pen/JMVBeV*/
