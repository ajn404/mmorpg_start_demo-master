import { _decorator, Animation, Component } from "cc";
import { FsmParamTypeEnum } from "../enum";
import State from "./State";

const { ccclass } = _decorator;

type ParamsValueType = boolean | number;

export interface IParamsValue {
  type: FsmParamTypeEnum;
  value: ParamsValueType;
}

export const getInitParamsTrigger = () => {
  return {
    type: FsmParamTypeEnum.Trigger,
    value: false,
  };
};

export const getInitParamsNumber = () => {
  return {
    type: FsmParamTypeEnum.Number,
    value: 0,
  };
};

/***
 * 流动图
 * 1.entity的state或者direction改变触发setter
 * 2.setter里触发fsm的setParams方法
 * 3.setParams执行run方法（run方法由子类重写）
 * 4.run方法会更改currentState，然后触发currentState的setter
 * 5-1.如果currentState是子状态机，继续执行他的run方法，run方法又会设置子状态机的currentState，触发子状态run方法
 * 5-2.如果是子状态，run方法就是播放动画
 */

/***
 * 有限状态机基类
 */
@ccclass("StateMachine")
export default abstract class StateMachine extends Component {
  private _currentState: State = null;
  params: Map<string, IParamsValue> = new Map();
  stateMachines: Map<string, State> = new Map();
  animationComponent: Animation;

  getParams(paramName: string) {
    if (this.params.has(paramName)) {
      return this.params.get(paramName).value;
    }
  }

  setParams(paramName: string, value: ParamsValueType) {
    if (this.params.has(paramName)) {
      this.params.get(paramName).value = value;
      this.run();
      this.resetTrigger();
    }
  }

  get currentState() {
    return this._currentState;
  }

  set currentState(newState) {
    if (!newState) {
      return;
    }
    this._currentState = newState;
    this._currentState.run();
  }

  /***
   * 清空所有trigger
   */
  resetTrigger() {
    for (const [, value] of this.params) {
      if (value.type === FsmParamTypeEnum.Trigger) {
        value.value = false;
      }
    }
  }

  /***
   * 由子类重写，方法目标是根据当前状态和参数修改currentState
   */
  abstract init(...args: any[]): void;
  abstract run(): void;
}
