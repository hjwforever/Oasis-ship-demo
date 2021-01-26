import 'regenerator-runtime';

import {
  Entity,
  Engine,
  MeshRenderer,
  SpriteRenderer,
  GPUParticleSystem,
  Vector3
} from 'oasis-engine';

import CoinController from './coins';
import Coin from './coin';
import CoinRotate from './coinRotate';

// 设置金币数
const COUNT = 14;

// 给 entity 实体添加金币模型
async function addCoinModel(engine: Engine, entity: Entity) {
  // 加载模型
  const gltf = await engine.resourceManager.load('https://gw.alipayobjects.com/os/OasisHub/71919cef-d58e-41c2-b5d9-5277ec668fc0/150000189/0.5631354547806537.gltf');
  entity.addChild(gltf.defaultSceneRoot.clone());
  // 获取 mesh
  const mesh = gltf.defaultSceneRoot.findByName('coin').getComponent(MeshRenderer);
  // 获取材质
  const material = mesh.getSharedMaterial(0);
  // 法线纹理
  const normalTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/d65f2bb7-b63a-4a4f-9555-2be52de35d5a/150000189/0.5841235862272591.webp');
  material.normalTexture = normalTexture;
  // 基础颜色纹理
  const baseColorTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/345fb38f-9256-42c6-8986-12d26c6a407f/150000189/0.29263800037768006.webp');
  material.baseColorTexture = baseColorTexture;
}

// 给 entity 实体添加金币爆炸粒子效果
async function addCoinParticle(engine: Engine, entity: Entity, url: String) {
  const particleSystem = entity.addComponent(GPUParticleSystem);

  // 粒子贴图
  const particleTexture = await engine.resourceManager.load(url);
  
  // 初始化
  particleSystem.initialize({
    texture: particleTexture,
    maxCount: 30, // 最大粒子数
    is2d: true,
    scaleFactor: 1,
    once: true,
    defaultStart: false,
    fadeOut: true,
    useOriginColor: true,
    options: {
      size: 0.1, // 粒子大小
      lifetime: 0.5,
      alpha: 1,
      position: new Vector3(0, 1, 0),
      sizeRandomness: 0.58,
      velocityRandomness: new Vector3(10, 10, 0.5), // 速度随机范围
      acceleration: new Vector3(0, -0.05, 0),
    }
  });
}

async function addCoin(engine: Engine, entity: Entity) {
  // 金币的实体，包含金币所有内容
  const coinWrap = entity.createChild('coinWrap');

  // 金币模型
  const goldCoin = coinWrap.createChild('goldCoin');
  await addCoinModel(engine, goldCoin);
  goldCoin.transform.setScale(4, 4, 4);

  // 金币爆炸特效
  const particle1 = coinWrap.createChild('particle1');
  const particle2 = coinWrap.createChild('particle2');
  await addCoinParticle(engine, particle1, 'https://gw.alipayobjects.com/zos/OasisHub/da1e3665-abc6-4a35-8d70-4fcf19d59185/150000189/0.5111155083291377.png');
  await addCoinParticle(engine, particle2, 'https://gw.alipayobjects.com/zos/OasisHub/91b42013-c363-4c07-a4ce-d9f68d220872/150000189/0.4787941223905743.png');

  // 金币气泡
  const bubble = coinWrap.createChild('bubble');
  // 添加渲染 sprite 的组件
  const bubbleComp = bubble.addComponent(SpriteRenderer);
  // 气泡纹理
  const bubbleTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/6045ac93-1d30-4b6d-b560-7ecfa0aab0d4/150000189/0.2759570141884551.png');
  bubbleComp.texture = bubbleTexture;
  bubble.transform.setScale(0.25, 0.25, 0.25);

  // 给 goldCoin 实体添加 coinRotate.ts 脚本来控制金币自旋转
  goldCoin.addComponent(CoinRotate);
  // 给 coinWrap 实体添加 coin.ts 组件来控制单个金币的左右移动
  coinWrap.addComponent(Coin);
}

export default async function init(engine: Engine, rootEntity: Entity) {
  // coins 实体，作为所有金币的容器
  const coins = rootEntity.createChild('coins');
  coins.transform.setPosition(0, 0, -5);

  for (let i = 0; i < COUNT; ++i) {
    await addCoin(engine, coins);
  }

  // 给 coins 实体添加 coins.ts 脚本，统一管理所有金币
  coins.addComponent(CoinController);
}
