import {
  Event,
  Script,
  BoxCollider,
  CollisionDetection,
  Vector3
} from 'oasis-engine';

// 碰到金币事件
const coinEvent = new Event('colliderCoin');

/**
 * 使用时再重写，性能可以得到提升
 */
export default class ShipController extends Script {
  /**
   * 第一次触发可用状态时调用,只调用一次。
   */
  onAwake() {
    const boxCollider = this.entity.addComponent(BoxCollider);
    boxCollider.size = new Vector3(2, 1, 2);
    
    const cd = this.entity.addComponent(CollisionDetection);
    cd.addEventListener('begin_overlop', (e) => {
      // e 返回了被检测到当前和飞船发生碰撞的碰撞体信息
      const collider = e.data.collider.entity;
      collider.trigger(coinEvent);
    });
  }
}
