import 'regenerator-runtime';

import {
  Entity,
  Engine,
  MeshRenderer,
  AmbientLight,
  GPUParticleSystem,
  Vector3
} from 'oasis-engine';

import ShipAni from './shipAni';
import ShipController from './ship';

// 给 entity 实体添加飞船模型
async function addShip(engine: Engine, entity: Entity) {
  // 加载模型
  const gltf = await engine.resourceManager.load('https://gw.alipayobjects.com/os/OasisHub/feb92a84-616f-43c9-8855-59bf64637ffe/47000054/0.6954274921449404.gltf');
  entity.addChild(gltf.defaultSceneRoot);
  // 获取 mesh
  const mesh = gltf.defaultSceneRoot.findByName('feichuan').getComponent(MeshRenderer);
  // 获取材质
  const material = mesh.getSharedMaterial(0);
  // 法线纹理
  const normalTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/883804df-dc71-439e-a0f7-c6d5f39f975e/47000054/0.41043666532942336.jpg');
  material.normalTexture = normalTexture;
  // 基础颜色纹理
  const baseColorTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/59ac6721-a745-4857-813b-d69e9dd651f6/47000054/0.04283367251926573.jpg');
  material.baseColorTexture = baseColorTexture;
}

// 给 entity 实体添加飞船尾焰模型
async function addShipTail(engine: Engine, entity: Entity) {
  // 加载模型
  const gltf = await engine.resourceManager.load('https://gw.alipayobjects.com/os/OasisHub/d9cf6a72-da05-47c7-841a-7ccb18a5365f/150000189/0.09179495538738736.gltf');
  entity.addChild(gltf.defaultSceneRoot);
  // 获取mesh
  const mesh = gltf.defaultSceneRoot.findByName('jet').getComponent(MeshRenderer);
  // 获取材质
  const material = mesh.getSharedMaterial(0);
  // 基础颜色纹理
  const baseColorTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/b4f25271-a2eb-4a62-ac25-bf23b1c68151/150000189/0.2201750114223915.png');
  material.baseColorTexture = baseColorTexture;
}

// 给 entity 实体添加飞船尾焰喷射粒子
async function addTailParticle(engine: Engine, entity: Entity) {
  const particleSystem = entity.addComponent(GPUParticleSystem);

  // 粒子贴图
  const particleTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/bd850ee7-2b77-476b-9526-6d974e823c4c/150000189/0.07298479906716682.png');
  
  // 初始化
  particleSystem.initialize({
    texture: particleTexture,
    maxCount: 100, // 最大粒子数
    is2d: false,
    scaleFactor: 1,
    defaultStart: true,
    fadeOut: true,
    options: {
      size: 0.2, // 粒子大小
      lifetime: 0.6,
      alpha: 1,
      sizeRandomness: 0.6,
      startTimeRandomness: 10,
      colorRandomness: 1,
      velocity: new Vector3(0, 0, 5),
      velocityRandomness: new Vector3(1.5, 0.5, 0.5), // 速度随机范围
    }
  });
  // 播放粒子
  particleSystem.start();
}

export default async function init(engine: Engine, rootEntity: Entity) {
  // ship 实体
  const shipEntity = rootEntity.createChild('ship');

  // 飞船前方的发射带
  const track = shipEntity.createChild('track');
  // 给 track 添加模型
  const trackGLTF = await engine.resourceManager.load('https://gw.alipayobjects.com/os/OasisHub/5c05f276-70d9-4d51-b83e-f5782bc4ab6e/150000189/0.1730597204627864.gltf');
  track.addChild(trackGLTF.defaultSceneRoot);
  // 调整 track 的 position/scale
  track.transform.setPosition(0, -0.27, 0.135);
  track.transform.setScale(0.2, 0.1, 0.15);

  // 飞船自身 包含飞船和尾焰
  const body = shipEntity.createChild('body');
  // 给 body 添加 shipAni 脚本，用来控制飞船动画
  body.addComponent(ShipAni);
  // 给 body 添加 ShipController 脚本，用来处理飞船碰撞逻辑
  body.addComponent(ShipController);
  // 飞船的船体
  const shell = body.createChild('shell');
  // 给 shell 添加飞船模型
  await addShip(engine, shell);
  // 飞船的尾焰
  const tail = body.createChild('tail');
  await addShipTail(engine, tail);
  // 添加尾焰喷射粒子
  const tailParticle = tail.createChild('tailParticle')
  await addTailParticle(engine, tailParticle);

  // 给 ship 添加环境光，让飞船看起来颜色更鲜亮一点
  const light = shipEntity.createChild('light');
  const lightComp = light.addComponent(AmbientLight);
  // 设置光照强度
  lightComp.intensity = 0.3;
}
