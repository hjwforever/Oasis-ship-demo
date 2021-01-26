import {
  Event,
  Script
} from 'oasis-engine';
import GameController from '../gameController';

const coinResetEvent = new Event('coin_reset');
const coinStartEvent = new Event('coin_start');

/**
 * 使用时再重写，性能可以得到提升
 */
export default class CoinController extends Script {
  /**
   * 第一次触发可用状态时调用,只调用一次。
   */
  onAwake() {
    const { entity } = this;
    const { children } = entity;
  
    entity.addEventListener('game_reset', () => {
      this.reset();
      
      children.forEach((child) => {
        child.trigger(coinResetEvent);
      });
    });

    entity.addEventListener('game_start', () => {
      this.reset();
      children.forEach((child) => {
        child.trigger(coinStartEvent);
      });
    });
  }

  /**
   * 在被销毁帧的最后调用。
   */
  onDestroy() {
    this.entity.removeAllEventListeners();
  }

  reset () {
    const coins = this.entity.children;
    for (let i = 0, l = coins.length; i < l; ++i) {
      const coin = coins[i];
      const pos = coin.transform.position;
      pos.z = -(i + 1) * 3;
      coin.transform.position = pos;
    }
  }
}
