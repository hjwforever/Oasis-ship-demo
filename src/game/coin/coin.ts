import {
  Event,
  Script,
  Entity,
  GPUParticleSystem,
  BoxCollider,
  Vector3
} from 'oasis-engine';
import GameController from '../gameController';

// const coinResetEvent = new Event('rotate_reset');
const coinStartEvent = new Event('rotate_start');
const getCoinEvent = new Event('get_coin');

/**
 * 使用时再重写，性能可以得到提升
 */
export default class Coin extends Script {
  private _goldCoin: Entity;
  private _bubble: Entity;
  private _startFlag: boolean = false; // 是否开始游戏状态
  private _time: number = 0;
  private _factor: number = 0.001;
  private _turn: number = 0;
  private _speed: number = 0;
  private _direction: string = 'x';
  private _particle1: GPUParticleSystem;
  private _particle2: GPUParticleSystem;

  /**
   * 第一次触发可用状态时调用,只调用一次。
   */
  onAwake() {
    const { entity } = this;
    
    this._goldCoin = entity.findByName('goldCoin');
    this._bubble = entity.findByName('bubble');

    // 确定方向为 x轴 还是 y轴
    this._direction = Math.random() > 0.5 ? 'x' : 'y';

    // 获取粒子系统组件
    setTimeout(() => {
      const particleEntity1 = entity.findByName('particle1');
      this._particle1 = particleEntity1.getComponent(GPUParticleSystem);
      const particleEntity2 = entity.findByName('particle2');
      this._particle2 = particleEntity2.getComponent(GPUParticleSystem);
    });

    this._turn = Math.random() < 0.5 ? 1 : -1;
    this._speed = Math.random() * 0.5 + 1.0;

    // 给金币添加碰撞体
    const boxCollider = this.entity.addComponent(BoxCollider);
    boxCollider.size = new Vector3(0.6, 0.6, 0.6);

    entity.addEventListener('coin_start', () => {
      this.reset();
      this.start();
      this._goldCoin.trigger(coinStartEvent);
    });

    // 被飞船碰撞到的逻辑
    entity.addEventListener('colliderCoin', () => {
      this._goldCoin.isActive = false;
      this._bubble.isActive = false;

      this._particle1 && this._particle1.start();
      this._particle2 && this._particle2.start();

      this._goldCoin.trigger(getCoinEvent);
      // // 增加分数， 每次碰撞分数+1
      // const score = document.getElementById('score');
      // const score_now = Number.parseFloat(score.innerText) + 1;
      // score.innerText = score_now.toString();
      // console.log('当前分数',score_now);
    });
  }

  /**
   * 主更新，在执行内部动画逻辑前调用，逐帧调用。
   * @param deltaTime 间隔时间 @deprecated
   */
  onUpdate(deltaTime) {
    if (!this._startFlag) {
      return ;
    }
    
    const { entity } = this;
    const { transform } = entity;

    const pos = transform.position;
    if(this._direction === 'x') {
      pos.x = Math.sin(this._time) * 1.6 * this._turn;
    } else {
      pos.y = Math.sin(this._time) * 1.6 * this._turn;
    }

    this._time += deltaTime * this._factor * this._speed;
    transform.position = pos;
  }

  /**
   * 在被销毁帧的最后调用。
   */
  onDestroy() {
    this.entity.removeAllEventListeners();
  }

  reset() {
    const { entity } = this;
    const { transform } = entity;

    this._goldCoin.isActive = true;
    this._bubble.isActive = true;

    entity.isActive = true;
    this._time = 0;
    this._startFlag = false;

    const pos = transform.position;
    pos.setValue(0, 0, pos.z);
    transform.position = pos;
  }

  start() {
    this._startFlag = true;
  }
}
