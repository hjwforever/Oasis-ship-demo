import { Script, Vector3, BoxCollider, CollisionDetection } from 'oasis-engine';

export default class Coin extends Script {
  onAwake() {
    const { entity } = this;

    // // 金币放大
    entity.transform.scale = new Vector3(2, 2, 2);
    // 设置金币位置
    entity.transform.position = new Vector3(1.5, 0, 0);

    // 添加碰撞组件
    const box = entity.addComponent(BoxCollider);
    box.size = new Vector3(0.3, 0.3, 0.3);

    // 给自身添加检测碰撞的组件
    const cd = entity.addComponent(CollisionDetection);
    // 碰撞事件监听
    cd.addEventListener('begin_overlop', (e) => {
      // 隐藏自己
      entity.isActive = false;
    });
  }

  onUpdate() {
    
  }

  onDestroy() {

  }
}