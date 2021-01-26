// import TWEEN from '@tweenjs/tween.js';
import {
  Event,
  Vector3,
  Script
} from 'oasis-engine';

const gameOverEvent = new Event('game_over');
const tempPos = new Vector3();
const preStartPos = new Vector3(0, 0, 10);
const startPos = new Vector3(0, 0, 0);

/**
 * 使用时再重写，性能可以得到提升
 */
export default class ShipAni extends Script {
  private _shipState: string = 'none'; // none 重置状态 start 启动飞船 float 飞船在起点上下浮动 play 发射飞船
  private _startTime: number = 30;
  private _curStartTime: number = 0;
  private _floatTime: number = 80;
  private _curFloatTime: number = 0;
  private _floatDist: number = 0.3;
  private _playEndPosZ: number = -120;
  private _playSpeed: number = -1;

  /**
   * 第一次触发可用状态时调用,只调用一次。
   */
  onAwake() {
    const { entity } = this;
    
    this.reset();

    entity.addEventListener('game_start', () => {
      this.reset();
      this._shipState = 'start';
      this._curStartTime = 0;
    });

    entity.addEventListener('game_play', () => {
      tempPos.setValue(0, 0, 0);
      setTimeout(() => {
        this._shipState = 'play';
      }, 1000);
    });
  }

  /**
   * 主更新，在执行内部动画逻辑前调用，逐帧调用。
   * @param deltaTime 间隔时间 @deprecated
   */
  onUpdate(deltaTime) {
    switch (this._shipState) {
      case 'start':
        this.playStart();
        break;
      case 'float':
        this.playFloat();
        break;
      case 'play':
        this.playPlay();
        break;
      default:
        break;
    }
  }

  /**
   * 在被销毁帧的最后调用。
   */
  onDestroy() {
    this.entity.removeAllEventListeners();
  }

  reset() {
    this._shipState = 'none';
    this.entity.transform.position = preStartPos;
  }

  // 播放启动飞船动画
  playStart() {
    this._curStartTime++;
    const z = Math.max(0, preStartPos.z - (preStartPos.z - startPos.z) * (this._curStartTime / this._startTime));
    tempPos.setValue(0, 0, z);
    this.entity.transform.position = tempPos;

    if (this._curStartTime === this._startTime) {
      this._shipState = 'float';
      this._curFloatTime = 0;
    }
  }

  // 播放飞船上下浮动动画
  playFloat() {
    const isUp: boolean = Math.floor(this._curFloatTime / this._floatTime) % 2 === 0; 
    const t = this._curFloatTime % this._floatTime;
    const v = this._floatDist / this._floatTime;
    let y = 0;

    if (isUp) {
      y = Math.min(t * v, this._floatDist);
    } else {
      y = Math.max((this._floatTime - t) * v, startPos.y);
    }

    this._curFloatTime++;
    tempPos.setValue(startPos.x, y, startPos.z);
    this.entity.transform.position = tempPos;
  }

  // 播放启动发射动画
  playPlay() {
    const { entity } = this;

    tempPos.z = Math.max(this._playEndPosZ, tempPos.z + this._playSpeed);
    entity.transform.position = tempPos;
    
    if (tempPos.z <= this._playEndPosZ) {
      this._shipState = 'none';

      entity.trigger(gameOverEvent);
    }
  }
}
