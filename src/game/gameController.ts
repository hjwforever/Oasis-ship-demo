import {
  Event,
  Script,
  Entity
} from 'oasis-engine';
import Swal from 'sweetalert2';

// 要用到的消息
const gameStartEvent = new Event('game_start');
const gamePlayEvent = new Event('game_play');
const gameOverEvent = new Event('game_over');
const getCoin = new Event('get_coin');


/**
 * 使用时再重写，性能可以得到提升
 */
export default class GameController extends Script {
  private _ship: Entity;
  private _coins: Entity;
  private _score: number;
  private coinScore = 1;  

  /**
   * 第一次触发可用状态时调用,只调用一次。
   */
  onAwake() {
    const { entity, engine } = this;

    this._ship = entity.findByName('body');
    this._coins = entity.findByName('coins');

    this.bindEvent();

    // 主动触发一次启动
    engine.trigger(gameStartEvent);
  }

  // 监听业务层消息
  bindEvent() {
    const { entity, engine } = this;

    // 启动游戏
    engine.addEventListener('game_start', () => {
      this._ship.trigger(gameStartEvent);
      this._coins.trigger(gameStartEvent);

      console.log('启动游戏， 分数归零');
      setScore(0);
    });

    // 发射飞船
    engine.addEventListener('game_play', () => {
      this._ship.trigger(gamePlayEvent);
      this._coins.trigger(gamePlayEvent);

      entity.trigger(gamePlayEvent);
      console.log('发射');
    });

    // 游戏结束
    this._ship.addEventListener('game_over', () => {
      entity.trigger(gameOverEvent);
      console.log('游戏结束，你的最终分数为：', this._score);

      Swal.fire(`游戏结束，你的最终分数为：${this._score}`).then(()=>
       // 重启游戏
       engine.trigger(gameStartEvent)
      );
    });

    // 获得金币 分数增加
    this._coins.addEventListener('get_coin', () => {
      console.log('获得金币');
      setScore(this._score + this.coinScore);
    });

    // // 获得分数
    // public getScore() {
    //   return this._score;
    // }

    // 设置分数
    const setScore = (score: number) => {
      this._score = score;
      console.log('当前分数:', this._score);
      document.getElementById('score').innerText = this._score.toString();
    }
  }

  /**
   * 在被销毁帧的最后调用。
   */
  onDestroy() {
    this.engine.removeAllEventListeners();
  }
}
