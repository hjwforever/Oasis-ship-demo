import {
  Script,
  Vector3
} from 'oasis-engine';

/**
 * 使用时再重写，性能可以得到提升
 */
export default class CoinRotate extends Script {
  private _startFlag: boolean = false; // 是否开始游戏状态
  private _rotateSpeed: number = 5;
  private _curRotation: Vector3 = new Vector3();

  /**
   * 第一次触发可用状态时调用,只调用一次。
   */
  onAwake() {
    const { entity } = this;

    this.reset();

    entity.addEventListener('rotate_start', () => {
      this.reset();
      this.start();
    });
  }

  /**
   * 主更新，在执行内部动画逻辑前调用，逐帧调用。
   * @param deltaTime 间隔时间 @deprecated
   */
  onUpdate(deltaTime) {
    if (!this.entity.isActive || !this._startFlag) {
      return ;
    }
    
    this._curRotation.y += this._rotateSpeed;
    this.entity.transform.rotation = this._curRotation;
  }

  /**
   * 在被销毁帧的最后调用。
   */
  onDestroy() {
    this.entity.removeAllEventListeners();
  }

  reset() {
    this._startFlag = false;
    this._curRotation.setValue(0, 0, 0);
    this.entity.transform.rotation = this._curRotation;
  }

  start() {
    this._startFlag = true;
  }
}
