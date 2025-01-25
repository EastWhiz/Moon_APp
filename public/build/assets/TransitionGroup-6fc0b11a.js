import{R as f,G as g,r as c}from"./app-adbb6c1a.js";import{_ as k}from"./Box-a30c2b2a.js";function R(i,o){if(i==null)return{};var a={};for(var r in i)if({}.hasOwnProperty.call(i,r)){if(o.indexOf(r)!==-1)continue;a[r]=i[r]}return a}function O(i,o){return O=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(a,r){return a.__proto__=r,a},O(i,o)}function y(i,o){i.prototype=Object.create(o.prototype),i.prototype.constructor=i,O(i,o)}const M={disabled:!1},T=f.createContext(null);var P=function(o){return o.scrollTop},b="unmounted",h="exited",E="entering",x="entered",S="exiting",d=function(i){y(o,i);function o(r,e){var t;t=i.call(this,r,e)||this;var n=e,s=n&&!n.isMounting?r.enter:r.appear,u;return t.appearStatus=null,r.in?s?(u=h,t.appearStatus=E):u=x:r.unmountOnExit||r.mountOnEnter?u=b:u=h,t.state={status:u},t.nextCallback=null,t}o.getDerivedStateFromProps=function(e,t){var n=e.in;return n&&t.status===b?{status:h}:null};var a=o.prototype;return a.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},a.componentDidUpdate=function(e){var t=null;if(e!==this.props){var n=this.state.status;this.props.in?n!==E&&n!==x&&(t=E):(n===E||n===x)&&(t=S)}this.updateStatus(!1,t)},a.componentWillUnmount=function(){this.cancelNextCallback()},a.getTimeouts=function(){var e=this.props.timeout,t,n,s;return t=n=s=e,e!=null&&typeof e!="number"&&(t=e.exit,n=e.enter,s=e.appear!==void 0?e.appear:n),{exit:t,enter:n,appear:s}},a.updateStatus=function(e,t){if(e===void 0&&(e=!1),t!==null)if(this.cancelNextCallback(),t===E){if(this.props.unmountOnExit||this.props.mountOnEnter){var n=this.props.nodeRef?this.props.nodeRef.current:g.findDOMNode(this);n&&P(n)}this.performEnter(e)}else this.performExit();else this.props.unmountOnExit&&this.state.status===h&&this.setState({status:b})},a.performEnter=function(e){var t=this,n=this.props.enter,s=this.context?this.context.isMounting:e,u=this.props.nodeRef?[s]:[g.findDOMNode(this),s],l=u[0],p=u[1],D=this.getTimeouts(),_=s?D.appear:D.enter;if(!e&&!n||M.disabled){this.safeSetState({status:x},function(){t.props.onEntered(l)});return}this.props.onEnter(l,p),this.safeSetState({status:E},function(){t.props.onEntering(l,p),t.onTransitionEnd(_,function(){t.safeSetState({status:x},function(){t.props.onEntered(l,p)})})})},a.performExit=function(){var e=this,t=this.props.exit,n=this.getTimeouts(),s=this.props.nodeRef?void 0:g.findDOMNode(this);if(!t||M.disabled){this.safeSetState({status:h},function(){e.props.onExited(s)});return}this.props.onExit(s),this.safeSetState({status:S},function(){e.props.onExiting(s),e.onTransitionEnd(n.exit,function(){e.safeSetState({status:h},function(){e.props.onExited(s)})})})},a.cancelNextCallback=function(){this.nextCallback!==null&&(this.nextCallback.cancel(),this.nextCallback=null)},a.safeSetState=function(e,t){t=this.setNextCallback(t),this.setState(e,t)},a.setNextCallback=function(e){var t=this,n=!0;return this.nextCallback=function(s){n&&(n=!1,t.nextCallback=null,e(s))},this.nextCallback.cancel=function(){n=!1},this.nextCallback},a.onTransitionEnd=function(e,t){this.setNextCallback(t);var n=this.props.nodeRef?this.props.nodeRef.current:g.findDOMNode(this),s=e==null&&!this.props.addEndListener;if(!n||s){setTimeout(this.nextCallback,0);return}if(this.props.addEndListener){var u=this.props.nodeRef?[this.nextCallback]:[n,this.nextCallback],l=u[0],p=u[1];this.props.addEndListener(l,p)}e!=null&&setTimeout(this.nextCallback,e)},a.render=function(){var e=this.state.status;if(e===b)return null;var t=this.props,n=t.children;t.in,t.mountOnEnter,t.unmountOnExit,t.appear,t.enter,t.exit,t.timeout,t.addEndListener,t.onEnter,t.onEntering,t.onEntered,t.onExit,t.onExiting,t.onExited,t.nodeRef;var s=R(t,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]);return f.createElement(T.Provider,{value:null},typeof n=="function"?n(e,s):f.cloneElement(f.Children.only(n),s))},o}(f.Component);d.contextType=T;d.propTypes={};function m(){}d.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:m,onEntering:m,onEntered:m,onExit:m,onExiting:m,onExited:m};d.UNMOUNTED=b;d.EXITED=h;d.ENTERING=E;d.ENTERED=x;d.EXITING=S;const W=d;function I(i){if(i===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return i}function C(i,o){var a=function(t){return o&&c.isValidElement(t)?o(t):t},r=Object.create(null);return i&&c.Children.map(i,function(e){return e}).forEach(function(e){r[e.key]=a(e)}),r}function G(i,o){i=i||{},o=o||{};function a(p){return p in o?o[p]:i[p]}var r=Object.create(null),e=[];for(var t in i)t in o?e.length&&(r[t]=e,e=[]):e.push(t);var n,s={};for(var u in o){if(r[u])for(n=0;n<r[u].length;n++){var l=r[u][n];s[r[u][n]]=a(l)}s[u]=a(u)}for(n=0;n<e.length;n++)s[e[n]]=a(e[n]);return s}function v(i,o,a){return a[o]!=null?a[o]:i.props[o]}function U(i,o){return C(i.children,function(a){return c.cloneElement(a,{onExited:o.bind(null,a),in:!0,appear:v(a,"appear",i),enter:v(a,"enter",i),exit:v(a,"exit",i)})})}function F(i,o,a){var r=C(i.children),e=G(o,r);return Object.keys(e).forEach(function(t){var n=e[t];if(c.isValidElement(n)){var s=t in o,u=t in r,l=o[t],p=c.isValidElement(l)&&!l.props.in;u&&(!s||p)?e[t]=c.cloneElement(n,{onExited:a.bind(null,n),in:!0,exit:v(n,"exit",i),enter:v(n,"enter",i)}):!u&&s&&!p?e[t]=c.cloneElement(n,{in:!1}):u&&s&&c.isValidElement(l)&&(e[t]=c.cloneElement(n,{onExited:a.bind(null,n),in:l.props.in,exit:v(n,"exit",i),enter:v(n,"enter",i)}))}}),e}var L=Object.values||function(i){return Object.keys(i).map(function(o){return i[o]})},V={component:"div",childFactory:function(o){return o}},N=function(i){y(o,i);function o(r,e){var t;t=i.call(this,r,e)||this;var n=t.handleExited.bind(I(t));return t.state={contextValue:{isMounting:!0},handleExited:n,firstRender:!0},t}var a=o.prototype;return a.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},a.componentWillUnmount=function(){this.mounted=!1},o.getDerivedStateFromProps=function(e,t){var n=t.children,s=t.handleExited,u=t.firstRender;return{children:u?U(e,s):F(e,n,s),firstRender:!1}},a.handleExited=function(e,t){var n=C(this.props.children);e.key in n||(e.props.onExited&&e.props.onExited(t),this.mounted&&this.setState(function(s){var u=k({},s.children);return delete u[e.key],{children:u}}))},a.render=function(){var e=this.props,t=e.component,n=e.childFactory,s=R(e,["component","childFactory"]),u=this.state.contextValue,l=L(this.state.children).map(n);return delete s.appear,delete s.enter,delete s.exit,t===null?f.createElement(T.Provider,{value:u},l):f.createElement(T.Provider,{value:u},f.createElement(t,s,l))},o}(f.Component);N.propTypes={};N.defaultProps=V;const X=N;export{X as T,y as _,W as a,R as b,P as f};
