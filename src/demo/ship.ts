import { Script, Vector3, BoxCollider } from 'oasis-engine';

export default class ShipController extends Script {
  static tempPos: Vector3 = new Vector3(); // 用来缓存中间某个时间点的位置
  static startPos: Vector3 = new Vector3(); // 用来缓存飞船起始位置

  private _curMoveTime: number; // 当前总共移动时长
  private _moveTime: number; // 单次移动时长
  private _speed: number; // 飞船移动速度

  // 组件第一次触发为激活时调用，这里我们来做一些初始化操作
  onAwake() {
    this._curMoveTime = 0;
    this._moveTime = 80;
    this._speed = 1;
    ShipController.tempPos.setValue(0, 0, 0);
    ShipController.startPos.setValue(-10, 0, 0);

    // 添加碰撞组件
    const box = this.entity.addComponent(BoxCollider);
    // 设置碰撞体大小
    box.size = new Vector3(0.6, 0.6, 0.6);
  }

  // 引擎主循环的回调，我们在这里实现一些动画，让飞船动起来
  onUpdate() {
    const isLeft: boolean = Math.floor(this._curMoveTime / this._moveTime) % 2 === 0; 
    const t = this._curMoveTime % this._moveTime;
    const v = this._speed / this._moveTime;
    let x = ShipController.tempPos.x;

    if (isLeft) {
      x = Math.min(t * v, this._speed);
    } else {
      x = Math.max((this._moveTime - t) * v, ShipController.startPos.x);
    }

    this._curMoveTime++;
    ShipController.tempPos.setValue(x, ShipController.startPos.y, ShipController.startPos.z);
    this.entity.transform.position = ShipController.tempPos;
  }

  onDestroy() {

  }
}