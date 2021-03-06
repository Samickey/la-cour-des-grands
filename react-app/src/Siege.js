import {Fragment, PureComponent, Component} from 'react';
import groupes from './groupes.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import "./Siege.css"

export class EmptySiege extends PureComponent {

  constructor(props) {
    super();
  }

  render() {
    const {siege} = this.props
    if (siege.siegeno >= 4000 && siege.siegeno < 5000) {
     return <circle
       style={{fillOpacity: 0, stroke: "#FFCC77", strokeWidth: 0.03}}
        cx={siege.pos.x}
        cy={siege.pos.y}
        r={0.5}
     />
   } else if (siege.siegeno >= 3000 && siege.siegeno < 4000) {
     return <circle
       style={{fillOpacity: 0, stroke: "#FFCC77", strokeWidth: 0}}
        cx={siege.pos.x}
        cy={siege.pos.y}
        r={0.5}
     />
   } else {
     return <circle
       style={{fillOpacity: 0, stroke: "#ffffff", strokeWidth: 0.03}}
        cx={siege.pos.x}
        cy={siege.pos.y}
        r={0.5}
     />
   }
  }
}

class Siege extends PureComponent {

  constructor(props) {
    super();
  }

  render() {
    // console.log(siege.img)
    const {siege, showPic, app, highlight, x, y, h,s,v, sIdx, colIdx} = this.props
    const color = {h,s,v}
    const warning = siege.depute?.nom ? null : <g  transform="translate(-0.1, -0.7) scale(0.30)">
      <FontAwesomeIcon icon={faExclamation} color="red"/>
    </g>

    const imgsize = 1.4
    if (siege.depute) {
      const hoverClass = highlight ? "hover" : ""
      // const filter = highlight ? "url(#f3)" : ""
      const stroke = highlight ? "hsla(31, 50%, 100%, 1)" : ""
      const Pic = () => showPic ? <Fragment>
              <clipPath id={siege.siegeid+"-clippath"}>
                <circle r="0.53"/>
              </clipPath>
              <image opacity={0.8}
                  href={`/depute-pic/${siege.depute.uid}.png`}
                  x={-imgsize/2}
                  y={-imgsize/2}
                  height={imgsize}
                  width={imgsize}
                  clipPath={"url(#" + siege.siegeid+"-clippath)"}
              /></Fragment> : null
      const style = {
        transition: `transform ${Math.random() * 0.65 + 0.65}s ease ${Math.random()*0.3 + 0.3}s`,
        transform: `translate(${x}px, ${y}px)`
      }
      const debugpos = <text fontSize={0.2}>{sIdx + ":" + colIdx}</text>
      return <g style={style}
        data-id={siege.siegeno} data-color={JSON.stringify(color)}
        onMouseEnter={() => app.showDetail(siege)}
        onClick={() => app.pinDetail(siege)}
      >
        <g  className={`bloup ${hoverClass}`}>
          <defs>
            <filter id="f3" x="-1" y="-1" width="300%" height="300%">
              <feGaussianBlur result="blurOut" in="SourceGraphic" stdDeviation="0.2" />
              <feColorMatrix result="matrixOut" in="blurOut" type="matrix"
              values="10 0 0 0 0 0 10 0 0 0 0 0 10 0 0 0 0 0 1 0" />
              <feBlend in="SourceGraphic" in2="matrixOut" mode="normal" />
            </filter>
            <filter id="blurMe">
             <feGaussianBlur in="SourceGraphic" stdDeviation="0.1"/>
            </filter>
          </defs>
          <circle className="color-transition"
             style={{fill: `hsl(${color.h},${color.s * 0.7}%,${color.v}%)`}}
             r={0.53} strokeWidth="0.05" fillOpacity="1" stroke={stroke}
          />
          <Pic/>
          {warning}

        </g>
      </g>
    } else {
      return <EmptySiege siege={siege}/>
    }
  }


}

export default Siege
