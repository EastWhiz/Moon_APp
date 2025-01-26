import{r as a,j as e,a as qe}from"./app-5a73667c.js";import{A as Ie}from"./AuthenticatedLayout-cf891ac0.js";import"./ToggleSmall-bf81d3b4.js";import"./sweetalert2.all-08451b17.js";import{u as Me,a as Be,I as d,B as O,b as y,S as $e,c as De,P as Le,C as G}from"./Select-b0ab6a72.js";import{M as K,B as X,F as Y}from"./Modal-9e11a819.js";import{B as m,T as j}from"./Box-72fbf6f7.js";import{T as Qe,a as Ee,b as He,c as Z,d as f,e as Ve}from"./TableRow-a896c0c2.js";import"./ApplicationLogo-e5a888bf.js";import"./ResponsiveNavLink-a0ffdd01.js";import"./transition-35b84920.js";import"./TransitionGroup-33a8210d.js";import"./CSSTransition-8d49d2db.js";import"./useSlot-f8adfdd4.js";import"./useTheme-01923715.js";function it({auth:ee}){const[te,se]=a.useState(""),[u,ae]=a.useState(!1),[le,ne]=a.useState([]),[N,re]=a.useState(!1),[q,I]=a.useState(!1),ie=t=>{const s=t.items.map((r,l)=>({item:r.name,quantity:r.quantity,price:r.price}));ae({id:t.order_name,customerName:t.customer_name,address:t.customer_address,address_two:t.customer_address_two,total:t.final_total,items:s,financialStatus:t.payment_status,fulfillmentStatus:t.fulfillment_status?t.fulfillment_status:"N/A"}),I(!0)},M=()=>I(!1),[B,$]=a.useState(!1),D=(t,s)=>{re(s),se(t),$(!0)},L=()=>$(!1),oe={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:{xs:"90%",sm:"70%",md:"60%",lg:"50%",xl:"50%"},bgcolor:"background.paper",boxShadow:24,p:3,pt:2,height:"420px",overflow:"auto"},ce={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:{xs:"90%",sm:"70%",md:"35%",lg:"32%",xl:"32%"},bgcolor:"background.paper",boxShadow:24,p:3,pt:3,overflow:"auto"};let x=null;const de={singular:"order",plural:"prints"},[i,ue]=a.useState([]),pe=[{label:"5",value:"5"},{label:"10",value:"10"},{label:"20",value:"20"},{label:"50",value:"50"},{label:"100",value:"100"}],[S,he]=a.useState("10"),xe=a.useCallback(t=>{he(t),o(!n)},[i]),[C,me]=a.useState(0),fe=["All"].map((t,s)=>({content:t,index:s,onAction:()=>{},id:`${t}-${s}`,isLocked:s===0,actions:[]})),ge=[{label:"Id",value:"id asc",directionLabel:"Ascending"},{label:"Id",value:"id desc",directionLabel:"Descending"}],[_,be]=a.useState(["id desc"]),{mode:ye,setMode:je}=Me(),Ce=()=>{},[v,Q]=a.useState(""),[g,E]=a.useState([]),[b,H]=a.useState([]),[c,w]=a.useState({path:route("prints.get"),next_cursor:null,next_page_url:null,prev_cursor:null,prev_page_url:null}),[V,p]=a.useState(null),[_e,T]=a.useState(!1),[n,o]=a.useState(!1),{selectedResources:W,allResourcesSelected:Se,handleSelectionChange:ve}=Be(i);a.useEffect(()=>{let t=new URL(c.path);S&&t.searchParams.set("page_count",S),V&&t.searchParams.set("cursor",V),C==0?t.searchParams.delete("status"):C==1?t.searchParams.set("status","approved"):C==2&&t.searchParams.set("status","unapproved"),v!=""?t.searchParams.set("q",v):t.searchParams.delete("q"),_!=""?t.searchParams.set("q5",_[0]):t.searchParams.delete("q5"),g.length!=0?t.searchParams.set("q2",JSON.stringify(g)):t.searchParams.delete("q2"),b.length!=0?t.searchParams.set("q6",JSON.stringify(b)):t.searchParams.delete("q6"),t=t.toString(),T(!0),fetch(t).then(s=>s.json()).then(s=>{if(s.success==!0){ne(s.data2.map((l,z)=>({value:l.id,label:l.store_name?l.store_name:l.name})));const r=s.data.data.map((l,z)=>({id:l.id,store_name:l.shop?l.shop.store_name?l.shop.store_name:l.shop.name:"N/a",order_date:new Date(l.order_created_at).toISOString().split("T")[0],order_no:l.order_name,customer_name:l.customer_name,customer_email:l.email,order_total:`$${l.final_total}`,greeting_card:l.cards.length>0?l.cards[0]:!1,message:l.messages?l.messages.message:!1,order:l}));ue(r),w({path:s.data.path,next_cursor:s.data.next_cursor,next_page_url:s.data.next_page_url,prev_cursor:s.data.prev_cursor,prev_page_url:s.data.prev_page_url})}T(!1)}).catch(s=>{T(!1)})},[n]),a.useEffect(()=>{o(!n)},[_]);const we=a.useCallback(t=>{Q(t),clearTimeout(x),x=setTimeout(()=>{p(null),o(!n)},500)},[i]),Te=a.useCallback(t=>{E(t),clearTimeout(x),x=setTimeout(()=>{p(null),o(!n)},500)},[i]),ke=a.useCallback(t=>{H(t),clearTimeout(x),x=setTimeout(()=>{p(null),o(!n)},500)},[i]),k=a.useCallback(()=>{Q(""),p(null),o(!n)},[i]),P=a.useCallback(()=>{E([]),p(null),o(!n)},[i]),A=a.useCallback(()=>{H([]),p(null),o(!n)},[i]),Pe=a.useCallback(()=>{k(),P(),A()},[k,P,A]),Ae=[{key:"filterbyshop",label:"Filter by Shop",filter:e.jsx(G,{title:"Option Set Type",titleHidden:!0,choices:le,selected:g||[],onChange:Te,allowMultiple:!0})},{key:"filterbycard",label:"Filter by Moonora",filter:e.jsx(G,{title:"Type",titleHidden:!0,choices:[{value:"card",label:"Card"},{value:"message",label:"Message"}],selected:b||[],onChange:ke})}],F=[];if(!J(g)){const t="filterbyshop";F.push({key:t,label:U(t,g),onRemove:P})}if(!J(b)){const t="filterbycard";F.push({key:t,label:U(t,b),onRemove:A})}const Fe=i.map(({id:t,store_name:s,order_date:r,order_no:l,customer_name:z,customer_email:We,order_total:Re,greeting_card:h,order:Oe,message:R},Ne)=>e.jsxs(d.Row,{id:t,selected:W.includes(t),position:Ne,children:[e.jsx(d.Cell,{children:l}),e.jsx(d.Cell,{children:s}),e.jsx(d.Cell,{children:h&&h.pairbo_product_id?h.pairbo_product_id:"N/a"}),e.jsx(d.Cell,{children:r}),e.jsx(d.Cell,{children:Re}),e.jsx(d.Cell,{children:h?e.jsx(O,{status:"success",children:"Card"}):R?e.jsx(O,{status:"attention",children:"Message"}):e.jsx(O,{status:"warning",children:"None"})}),e.jsxs(d.Cell,{children:[h?e.jsx(y,{onClick:()=>D(`${window.appURL}/${h.canvas_image}`,"CARD"),children:"Card"}):R?e.jsx(y,{onClick:()=>D(`${window.appURL}/${h.canvas_image}`,R),children:"Message"}):null,e.jsx("span",{style:{marginLeft:"10px"}}),e.jsx(y,{onClick:()=>ie(Oe),children:"Details"})]})]},t));return e.jsxs(Ie,{user:ee.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight",children:" Dashboard "}),children:[e.jsx(qe,{title:"Prints"}),e.jsx("div",{children:e.jsx(K,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:q,onClose:M,closeAfterTransition:!0,slots:{backdrop:X},slotProps:{backdrop:{timeout:100}},children:e.jsx(Y,{in:q,children:e.jsx(m,{sx:oe,children:u&&e.jsxs("div",{style:{backgroundColor:"white",margin:"auto",display:"flex",flexDirection:"column",height:"100%"},children:[e.jsxs(j,{variant:"h5",gutterBottom:!0,align:"left",children:["Order ",u.id]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"20px"},children:[e.jsxs(j,{variant:"body1",style:{textAlign:"left",maxWidth:"350px"},children:["Billing Address: ",u.address,e.jsx("br",{}),"Shipping Address: ",u.address_two]}),e.jsxs(j,{variant:"body1",style:{textAlign:"right"},children:["Financial Status: ",u.financialStatus,e.jsx("br",{}),"Fulfillment Status: ",u.fulfillmentStatus]})]}),e.jsx(Qe,{children:e.jsxs(Ee,{children:[e.jsx(He,{children:e.jsxs(Z,{children:[e.jsx(f,{align:"left",style:{fontWeight:"bold"},children:"Item"}),e.jsx(f,{align:"center",style:{fontWeight:"bold"},children:"Quantity"}),e.jsx(f,{align:"right",style:{fontWeight:"bold"},children:"Price"})]})}),e.jsx(Ve,{children:u.items.map((t,s)=>e.jsxs(Z,{children:[e.jsx(f,{align:"left",children:t.item}),e.jsx(f,{align:"center",children:t.quantity}),e.jsxs(f,{align:"right",children:["$",t.price*t.quantity]})]},s))})]})}),e.jsx("div",{style:{flex:"1"}}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:"15px"},children:e.jsxs(j,{variant:"h6",children:["Total: $",u.total]})}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:"10px"},children:e.jsx(y,{variant:"contained",color:"primary",onClick:M,children:"Close"})})]})})})})}),e.jsx("div",{children:e.jsx(K,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:B,onClose:L,closeAfterTransition:!0,slots:{backdrop:X},slotProps:{backdrop:{timeout:100}},children:e.jsx(Y,{in:B,children:e.jsx(m,{sx:ce,children:e.jsxs("div",{style:{backgroundColor:"white",margin:"auto",display:"flex",flexDirection:"column",height:"100%"},children:[N=="CARD"?e.jsx("img",{src:te,style:{objectFit:"cover",height:"340px"}}):e.jsx("p",{children:N}),e.jsx("div",{style:{flex:"1"}}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:"10px"},children:e.jsx(y,{variant:"contained",color:"primary",onClick:L,children:"Close"})})]})})})})}),e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsx("div",{className:"bg-white dark:bg-gray-800 overflow-hidden shadow-sm",children:e.jsxs(m,{p:2,children:[e.jsx(m,{children:e.jsxs(m,{sx:{display:"flex",justifyContent:"space-between",m:1,mb:2},children:[e.jsx(j,{variant:"h5",component:"div",sx:{fontSize:{xs:"20px",sm:"20px",md:"20px",lg:"22px",xl:"22px"}},children:"Prints"}),e.jsx($e,{labelInline:!0,label:"Rows:",options:pe,value:S,onChange:xe})]})}),e.jsxs(m,{children:[e.jsx(De,{sortOptions:ge,sortSelected:_,queryValue:v,queryPlaceholder:"Searching in all",onQueryChange:we,onQueryClear:k,onSort:be,cancelAction:{onAction:Ce,disabled:!1,loading:!1},tabs:fe,selected:C,onSelect:me,canCreateNewView:!1,filters:Ae,appliedFilters:F,onClearAll:Pe,mode:ye,setMode:je,loading:_e}),e.jsx(d,{resourceName:de,itemCount:i.length,selectedItemsCount:Se?"All":W.length,onSelectionChange:ve,headings:[{title:"Order #"},{title:"Merchant"},{title:"Product ID"},{title:"Date"},{title:"Order Total"},{title:"Moonora"},{title:"Action"}],hasMoreItems:!0,selectable:!1,children:Fe})]}),e.jsx("hr",{}),e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",paddingTop:"22px",paddingBottom:"5px"},children:e.jsx(Le,{hasNext:!!c.next_cursor,hasPrevious:!!c.prev_cursor,onNext:()=>{w({...c,path:c.next_page_url}),p(c.next_cursor),o(!n)},onPrevious:()=>{w({...c,path:c.prev_page_url}),p(c.prev_cursor),o(!n)}})})]})})})})]});function U(t,s){switch(t){case"filterbyshop":return`Filtered by shop: ${s.map(r=>r).join(", ")}`;case"filterbycard":return`Filtered by type: ${s.map(r=>r).join(", ")}`;default:return s}}function J(t){return Array.isArray(t)?t.length===0:t===""||t==null}}export{it as default};
