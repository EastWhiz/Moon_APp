import{r as c,j as s,q as et,a as st}from"./app-adbb6c1a.js";import{A as ot}from"./ClientLayout-b755b4ad.js";import"./sweetalert2.all-c127b7ee.js";import{g as G,a as j,s as A,u as F,c as C,b as B,m as _,K as q,T as f,B as h}from"./Box-a30c2b2a.js";import{b as I,a as nt,i as K,c as rt,L as V}from"./List-33b98472.js";import{u as it,b as Y}from"./useSlot-207f3fdd.js";import"./ResponsiveNavLink-8e9650a0.js";import"./transition-7e75a861.js";function at(e){return G("MuiListItem",e)}j("MuiListItem",["root","container","dense","alignItemsFlexStart","divider","gutters","padding","secondaryAction"]);const lt=j("MuiListItemButton",["root","focusVisible","dense","alignItemsFlexStart","disabled","divider","gutters","selected"]),ct=lt;function dt(e){return G("MuiListItemSecondaryAction",e)}j("MuiListItemSecondaryAction",["root","disableGutters"]);const pt=e=>{const{disableGutters:t,classes:o}=e;return B({root:["root",t&&"disableGutters"]},dt,o)},mt=A("div",{name:"MuiListItemSecondaryAction",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.root,o.disableGutters&&t.disableGutters]}})({position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",variants:[{props:({ownerState:e})=>e.disableGutters,style:{right:0}}]}),tt=c.forwardRef(function(t,o){const n=F({props:t,name:"MuiListItemSecondaryAction"}),{className:r,...i}=n,a=c.useContext(I),l={...n,disableGutters:a.disableGutters},d=pt(l);return s.jsx(mt,{className:C(d.root,r),ownerState:l,ref:o,...i})});tt.muiName="ListItemSecondaryAction";const xt=tt,ut=(e,t)=>{const{ownerState:o}=e;return[t.root,o.dense&&t.dense,o.alignItems==="flex-start"&&t.alignItemsFlexStart,o.divider&&t.divider,!o.disableGutters&&t.gutters,!o.disablePadding&&t.padding,o.hasSecondaryAction&&t.secondaryAction]},yt=e=>{const{alignItems:t,classes:o,dense:n,disableGutters:r,disablePadding:i,divider:a,hasSecondaryAction:l}=e;return B({root:["root",n&&"dense",!r&&"gutters",!i&&"padding",a&&"divider",t==="flex-start"&&"alignItemsFlexStart",l&&"secondaryAction"],container:["container"]},at,o)},gt=A("div",{name:"MuiListItem",slot:"Root",overridesResolver:ut})(_(({theme:e})=>({display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",width:"100%",boxSizing:"border-box",textAlign:"left",variants:[{props:({ownerState:t})=>!t.disablePadding,style:{paddingTop:8,paddingBottom:8}},{props:({ownerState:t})=>!t.disablePadding&&t.dense,style:{paddingTop:4,paddingBottom:4}},{props:({ownerState:t})=>!t.disablePadding&&!t.disableGutters,style:{paddingLeft:16,paddingRight:16}},{props:({ownerState:t})=>!t.disablePadding&&!!t.secondaryAction,style:{paddingRight:48}},{props:({ownerState:t})=>!!t.secondaryAction,style:{[`& > .${ct.root}`]:{paddingRight:48}}},{props:{alignItems:"flex-start"},style:{alignItems:"flex-start"}},{props:({ownerState:t})=>t.divider,style:{borderBottom:`1px solid ${(e.vars||e).palette.divider}`,backgroundClip:"padding-box"}},{props:({ownerState:t})=>t.button,style:{transition:e.transitions.create("background-color",{duration:e.transitions.duration.shortest}),"&:hover":{textDecoration:"none",backgroundColor:(e.vars||e).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}}}},{props:({ownerState:t})=>t.hasSecondaryAction,style:{paddingRight:48}}]}))),ht=A("li",{name:"MuiListItem",slot:"Container",overridesResolver:(e,t)=>t.container})({position:"relative"}),ft=c.forwardRef(function(t,o){const n=F({props:t,name:"MuiListItem"}),{alignItems:r="center",children:i,className:a,component:l,components:d={},componentsProps:U={},ContainerComponent:P="li",ContainerProps:{className:z,...D}={},dense:w=!1,disableGutters:b=!1,disablePadding:R=!1,divider:m=!1,secondaryAction:p,slotProps:y={},slots:v={},...T}=n,M=c.useContext(I),x=c.useMemo(()=>({dense:w||M.dense||!1,alignItems:r,disableGutters:b}),[r,M.dense,w,b]),E=c.useRef(null),u=c.Children.toArray(i),O=u.length&&nt(u[u.length-1],["ListItemSecondaryAction"]),N={...n,alignItems:r,dense:x.dense,disableGutters:b,disablePadding:R,divider:m,hasSecondaryAction:O},H=yt(N),W=it(E,o),$=v.root||d.Root||gt,S=y.root||U.root||{},L={className:C(H.root,S.className,a),...T};let g=l||"li";return O?(g=!L.component&&!l?"div":g,P==="li"&&(g==="li"?g="div":L.component==="li"&&(L.component="div")),s.jsx(I.Provider,{value:x,children:s.jsxs(ht,{as:P,className:C(H.container,z),ref:W,ownerState:N,...D,children:[s.jsx($,{...S,...!K($)&&{as:g,ownerState:{...N,...S.ownerState}},...L,children:u}),u.pop()]})})):s.jsx(I.Provider,{value:x,children:s.jsxs($,{...S,as:g,ref:W,...!K($)&&{ownerState:{...N,...S.ownerState}},...L,children:[u,p&&s.jsx(xt,{children:p})]})})}),J=ft;function It(e){return G("MuiListItemIcon",e)}j("MuiListItemIcon",["root","alignItemsFlexStart"]);const bt=e=>{const{alignItems:t,classes:o}=e;return B({root:["root",t==="flex-start"&&"alignItemsFlexStart"]},It,o)},vt=A("div",{name:"MuiListItemIcon",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.root,o.alignItems==="flex-start"&&t.alignItemsFlexStart]}})(_(({theme:e})=>({minWidth:56,color:(e.vars||e).palette.action.active,flexShrink:0,display:"inline-flex",variants:[{props:{alignItems:"flex-start"},style:{marginTop:8}}]}))),St=c.forwardRef(function(t,o){const n=F({props:t,name:"MuiListItemIcon"}),{className:r,...i}=n,a=c.useContext(I),l={...n,alignItems:a.alignItems},d=bt(l);return s.jsx(vt,{className:C(d.root,r),ownerState:l,ref:o,...i})}),Q=St;function Lt(e){return G("MuiListItemText",e)}const Ct=j("MuiListItemText",["root","multiline","dense","inset","primary","secondary"]),k=Ct,jt=e=>{const{classes:t,inset:o,primary:n,secondary:r,dense:i}=e;return B({root:["root",o&&"inset",i&&"dense",n&&r&&"multiline"],primary:["primary"],secondary:["secondary"]},Lt,t)},At=A("div",{name:"MuiListItemText",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[{[`& .${k.primary}`]:t.primary},{[`& .${k.secondary}`]:t.secondary},t.root,o.inset&&t.inset,o.primary&&o.secondary&&t.multiline,o.dense&&t.dense]}})({flex:"1 1 auto",minWidth:0,marginTop:4,marginBottom:4,[`.${q.root}:where(& .${k.primary})`]:{display:"block"},[`.${q.root}:where(& .${k.secondary})`]:{display:"block"},variants:[{props:({ownerState:e})=>e.primary&&e.secondary,style:{marginTop:6,marginBottom:6}},{props:({ownerState:e})=>e.inset,style:{paddingLeft:56}}]}),Pt=c.forwardRef(function(t,o){const n=F({props:t,name:"MuiListItemText"}),{children:r,className:i,disableTypography:a=!1,inset:l=!1,primary:d,primaryTypographyProps:U,secondary:P,secondaryTypographyProps:z,slots:D={},slotProps:w={},...b}=n,{dense:R}=c.useContext(I);let m=d??r,p=P;const y={...n,disableTypography:a,inset:l,primary:!!m,secondary:!!p,dense:R},v=jt(y),T={slots:D,slotProps:{primary:U,secondary:z,...w}},[M,x]=Y("primary",{className:v.primary,elementType:f,externalForwardedProps:T,ownerState:y}),[E,u]=Y("secondary",{className:v.secondary,elementType:f,externalForwardedProps:T,ownerState:y});return m!=null&&m.type!==f&&!a&&(m=s.jsx(M,{variant:R?"body2":"body1",component:x!=null&&x.variant?void 0:"span",...x,children:m})),p!=null&&p.type!==f&&!a&&(p=s.jsx(E,{variant:"body2",color:"textSecondary",...u,children:p})),s.jsxs(At,{className:C(v.root,i),ownerState:y,ref:o,...b,children:[m,p]})}),X=Pt,Z=rt(s.jsx("circle",{cx:"12",cy:"12",r:"8"}),"FiberManualRecord");function Ft({auth:e}){et().props.ziggy;const o=["Login at https://apps.shopify.com","In the search bar, type “Pairbo”","Click the “Pairbo” app and select the install button","Once installed, login at https://www.shopify.com and click the “Home” button on the left-hand navigation panel","Scroll to the bottom of the left-hand navigation panel and click the arrow next to “Apps”","In the search bar, type “Pairbo” to have our app listed in the navigation panel","Click the “Pairbo” app in the navigation panel to view order details"],n=["After Installation. Go to Online Store > Themes > Customize","Go to App Embeds Section","Enable Pairbo - App"];return s.jsxs(ot,{header:s.jsx("h2",{className:"font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight",children:" Dashboard "}),children:[s.jsx(st,{title:"Orders"}),s.jsx("div",{className:"py-12",children:s.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:s.jsxs("div",{className:"bg-white dark:bg-gray-800 overflow-hidden shadow-sm",children:[s.jsxs(h,{p:2,pb:0,children:[s.jsx(h,{sx:{m:1,mb:-1},children:s.jsx(f,{variant:"h5",component:"div",sx:{fontSize:{xs:"20px",sm:"20px",md:"20px",lg:"22px",xl:"22px"}},children:"App Installation:"})}),s.jsx(V,{children:o.map((r,i)=>s.jsxs(J,{children:[s.jsxs(Q,{children:[s.jsx(Z,{style:{color:"black",fontSize:"15px"}})," "]}),s.jsx(h,{sx:{ml:-3},children:s.jsx(X,{primaryTypographyProps:{style:{textAlign:"left"}},primary:r})})]},i))})]}),s.jsxs(h,{p:2,pt:0,children:[s.jsx(h,{sx:{m:1,mb:-1},children:s.jsx(f,{variant:"h5",component:"div",sx:{fontSize:{xs:"20px",sm:"20px",md:"20px",lg:"22px",xl:"22px"}},children:"App Configuration:"})}),s.jsx(V,{children:n.map((r,i)=>s.jsxs(J,{children:[s.jsxs(Q,{children:[s.jsx(Z,{style:{color:"black",fontSize:"15px"}})," "]}),s.jsx(h,{sx:{ml:-3},children:s.jsx(X,{primaryTypographyProps:{style:{textAlign:"left"}},primary:r})})]},i))})]})]})})})]})}export{Ft as default};
