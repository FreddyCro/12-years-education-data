/**
 * The scroll event to handle that triggering if the target element is obseravle.
 * @method observableEvent
 * @param {String} target - the id of target element
 * 
 * @param {Object} option - option
 * @property {type} string: default: w (p / w)
 * @property {top} number: default: 0
 * @property {bottom} number: default: 0
 * @property {enterEvent} method: default: null
 * @property {leaveEvent} method: default: null
 * @property {aboveEvent} method: default: null
 * @property {underEvent} method: default: null
 */


const typePixel = 'p';
const typeWindowHeight = 'w';
const targetStyle = {
  outline: '#4CAF50 solid 5px',
}
const indicatorStyle = {
  position: 'absolute',
  zIndex: 9999,
  left: 0,
  backgroundColor: 'red',
  color: '#ffffff'
}

class OberservableElement {
  constructor(target, top, bottom) {
    this.target = target;
    this.top = top;
    this.bottom = bottom;
    this.elemnt = null;
  }

  get targetElement() {
    return document.querySelector(this.target);
  }

  addElementStyle(style) {
    Object.keys(style).forEach(e => {
      this.targetElement.style[e] = style[e];
    })
  }
}

class TriggerIndicator extends OberservableElement {
  constructor(target, top, bottom, pos) {
    super(target, top, bottom);
    this.pos = pos;
  }

  get indicatorId() {
    return `${this.target.split('#')[1]}-trigger-indicator-${this.pos}`;
  }

  get isExist() {
    return document.querySelector(`#${this.indicatorId}`) !== null;
  }

  get targetElement() {
    return document.querySelector(`#${this.indicatorId}`);
  }

  appendIndicator() {
    const indicator = document.createElement('div');
    indicator.id = this.indicatorId;
    indicator.innerText = `${this.target}-trigger-${this.pos}`;
    document.getElementsByTagName('body')[0].appendChild(indicator);

    this.setIndicatorPos();
  }

  setIndicatorPos() {
    if (this.pos === 'up') this.targetElement.style.top = `${this.top}px`;

    // TODO: bottom + OffsetTop + ClientHeight
    if (this.pos === 'down') this.targetElement.style.bottom = `${this.bottom}px`;
  }
}


function observableEventDebugger(target, top, bottom,) {
  const e = new OberservableElement(target, top, bottom);
  e.addElementStyle(targetStyle);

  const indicatorUp = new TriggerIndicator(target, top, bottom, 'up');
  const indicatorDown = new TriggerIndicator(target, top, bottom, 'down');
  if (!indicatorUp.isExist && !indicatorDown.isExist) {
    indicatorUp.appendIndicator();
    indicatorUp.addElementStyle(indicatorStyle);
    indicatorDown.appendIndicator();
    indicatorDown.addElementStyle(indicatorStyle);
  }

  return ;
}

export default function(target, option, debugMode) {
  if (target.split('#').langth <= 1) console.error('OberservableEvent: wrong target format!')

  const slide = document.querySelector(target);
  if (!slide) return;

  const pos = slide.getBoundingClientRect();
  
  let finalTop = 0;
  let finalBottom = 0;
  switch (option.type) {
    case typePixel:
      finalTop = option.top;
      finalBottom = option.bottom;
      break;
    case typeWindowHeight:
      finalTop = window.innerHeight * option.top;
      finalBottom = window.innerHeight * option.bottom;
      break;
    default:
      console.error('OberservableEvent: lack of type parameter!');
      break;
  }

  /*
    | above / leave position
    |———————————————————————
    | enter position
    |———————————————————————
    | under / leave position
  */

  // enter
  if (pos.top < finalTop && pos.bottom > finalBottom) {
    if (option.enterEvent) option.enterEvent();
    else console.error('OberservableEvent: lack of enterEvent parameter!');
  }
  // leave
  else if (option.leaveEvent) {
    option.leaveEvent();
    // above
    if (option.aboveEvent && pos.top >= finalTop) option.aboveEvent();
    // under
    if (option.underEvent && pos.bottom < finalBottom) option.underEvent();
  }

  if (debugMode) observableEventDebugger(target, finalTop, finalBottom);
}