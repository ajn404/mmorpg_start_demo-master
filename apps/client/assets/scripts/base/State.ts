import { animation, AnimationClip, Sprite, SpriteFrame } from "cc";
import DataManager from "../global/DataManager";
import StateMachine from "./StateMachine";

const INDEX_REG = /\((\d+)\)/;

const getNumberWithinString = (str: string) => parseInt(str.match(INDEX_REG)?.[1] || "0");

export const sortSpriteFrame = (spriteFrame: Array<SpriteFrame>) =>
  spriteFrame.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name));

/***
 * unit:milisecond
 */
export const ANIMATION_SPEED = 1 / 10;

/***
 * 状态（每组动画的承载容器，持有SpriteAnimation组件执行播放）
 */
export default class State {
  private animationClip: AnimationClip;
  constructor(
    private fsm: StateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private force: boolean = false
  ) {
    //生成动画轨道属性
    const track = new animation.ObjectTrack();
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty("spriteFrame");
    const spriteFrames = DataManager.Instance.textureMap.get(this.path);
    const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, index) => [
      index * ANIMATION_SPEED,
      item,
    ]);
    track.channel.curve.assignSorted(frames);

    //动画添加轨道
    this.animationClip = new AnimationClip();
    this.animationClip.name = this.path;
    this.animationClip.duration = frames.length * ANIMATION_SPEED;
    this.animationClip.addTrack(track);
    this.animationClip.wrapMode = this.wrapMode;
  }

  run() {
    if (this.fsm.animationComponent.defaultClip?.name === this.animationClip.name && !this.force) {
      return;
    }
    this.fsm.animationComponent.defaultClip = this.animationClip;
    this.fsm.animationComponent.play();
  }
}
