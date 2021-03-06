import React from 'react';
import SiegeDetail from './SiegeDetail.js'
import './App.css';
import DraggableSvg from './DraggableSvg.js'
import Footer  from './Footer.js'
import sieges from './sieges.json'
import Search  from './Search.js'
import Actions  from './Actions.js'
import Panel  from './Panel.js'
import visuals from "./visual/all.js"
import Caption from './Caption.js'
import {SiegesRenderer} from './layout/Layout.js'
import Siege from './Siege.js'
import {Transition, TransitionGroup} from 'react-transition-group';
import {SvgOpacityTransition} from './SvgOpacityTransition.js'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import blueGrey from '@material-ui/core/colors/blueGrey';
import green from '@material-ui/core/colors/green';
import CssBaseline from '@material-ui/core/CssBaseline';

function handleDarkMode() {
  const favicons = document.querySelectorAll('head > link[rel="icon"][media]')
  for (const fav of favicons) {
    if (window.matchMedia(fav.media).matches && fav.dataset.host === window.location.hostname) {
      //console.log({fav}, true)
    } else {
      fav.remove()
    }
  }
}

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    background: {
      default: grey[900],
      paper: grey[900]
    },
  },
})

//#212121

class App extends React.PureComponent {

  constructor() {
    super()
    this.sieges = sieges
    var randomSiege;
    while (!randomSiege?.depute) randomSiege = sieges[Math.floor(Math.random() * sieges.length)];
    this.state = {
      detail: randomSiege,
      pinned: null,
      showPic: visuals.showPic,
      visualColorName: visuals.default.color,
      visualLayoutName: visuals.default.layout,
      panelOpen: false,
      highlightSiegeIds: [],
      invertSiege: false,
      scrutinIdColor: visuals.default.scrutinIdColor,
      scrutinIdLayout: visuals.default.scrutinIdLayout 
    }
    window.sieges = sieges
    window.onpopstate = function(event) {
      const params = new URLSearchParams(window.location.search);
      this.setVisual(params.get("visual") || visuals.default, false)
      this.showPic(params.get("showPic") === 'true' || visuals.showPic, false)
    }.bind(this);
  }

  setHighlightSiegeIds(highlightSiegeIds) {
    this.setState({highlightSiegeIds})
  }

  showDetail(siege) {
    this.setState({detail: siege, highlightSiegeIds: [siege.siegeid]})
  }

  pinDetail(siege) {
    if (siege === null) {
      //unpin case
      this.setState({
        detail: this.state.pinned,
        pinned: null
      })
    }  else {
      this.setState({
        pinned: siege
      })
    }
  }

  showPic(show, pushState) {
    this.setState({
      showPic: show
    })
    if (pushState) {
      const params = new URLSearchParams(window.location.search);
      if (show) {
        params.set("showPic", "true");
      } else {
        params.delete("showPic")
      }
      window.history.pushState(null, null, decodeURIComponent(`${window.location.pathname}?${params}`));
    }
  }

  setVisualLayout(name, pushState) {
    this.setState({
      visualLayoutName: name
    })
    if (pushState) {
      const params = new URLSearchParams(window.location.search);
      params.set("layout", name);
      window.history.pushState(null, null, decodeURIComponent(`${window.location.pathname}?${params}`));
    }
  }

  setVisualColor(name, pushState) {
    this.setState({
      visualColorName: name
    })
    if (pushState) {
      const params = new URLSearchParams(window.location.search);
      params.set("color", name);
      window.history.pushState(null, null, decodeURIComponent(`${window.location.pathname}?${params}`));
    }
  }

  
  setScrutinIdLayout(id, pushState) {
    this.setState({
      scrutinIdLayout: id
    })
    if (pushState) {
      const params = new URLSearchParams(window.location.search);
      params.set("scrutinIdLayout", id);
      window.history.pushState(null, null, decodeURIComponent(`${window.location.pathname}?${params}`));
    }
  }

  setScrutinIdColor(id, pushState) {
    this.setState({
      scrutinIdColor: id
    })
    if (pushState) {
      const params = new URLSearchParams(window.location.search);
      params.set("scrutinIdColor", id);
      window.history.pushState(null, null, decodeURIComponent(`${window.location.pathname}?${params}`));
    }
  }

  togglePanel() {
    this.setState({panelOpen: !this.state.panelOpen})
  }

  render() {
    const app = this;
    const {pinned,  panelOpen, highlightSiegeIds, showPic} = this.state
    const {visualLayoutName, visualColorName, scrutinIdLayout, scrutinIdColor} = this.state
    const siege = this.state.pinned || this.state.detail
    const key = siege.siegeid + "detail" + (this.state.pinned ? "-pinned" : "")

    const visualColor = visualColorName == "scrutin"
      ? visuals.colors[visualColorName](scrutinIdColor)
      : visuals.colors[visualColorName] 
    const visualLayout = visualLayoutName == "perscrutin"
      ? visuals.layouts[visualLayoutName](scrutinIdLayout)(visualColor)
      : visuals.layouts[visualLayoutName](visualColor)
    const {Blueprint, Caption, siegeWithVisualProp} = visualLayout(this.sieges)
    //SiegeRenderer to avoid react add/remove siege from DOM

    return <ThemeProvider theme={theme}><div className="App">
      <CssBaseline/>
      <DraggableSvg app={app}>
        <TransitionGroup component={null}><SvgOpacityTransition key={visualLayoutName}>
            <Blueprint />
        </SvgOpacityTransition></TransitionGroup>
        <TransitionGroup component={null}><SvgOpacityTransition key={visualColorName}>
            <Caption app={app} />
        </SvgOpacityTransition></TransitionGroup>
        <SiegesRenderer  app={app} siegeWithVisualProp={siegeWithVisualProp}>
          {({siege, visualProps}) => <Siege
             app={app} highlight={highlightSiegeIds.includes(siege.siegeid)}
             siege={siege} key={siege.siegeid}
             showPic={showPic}
             {...visualProps}
           />}
        </SiegesRenderer>
      </DraggableSvg>
      <SiegeDetail app={app} {...siege} pinned={pinned} key={key}/>
      <Search app={app}/>
      <Footer/>
      <Panel app={app} visualLayoutName={visualLayoutName} visualColorName={visualColorName} open={true} showPic={showPic}/>
    </div></ThemeProvider>
  }

  componentDidMount() {
      handleDarkMode();
  }

}
export default App;
