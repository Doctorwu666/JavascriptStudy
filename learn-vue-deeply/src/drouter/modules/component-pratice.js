let name = "component-pratice";
export default {
    path: `/${name}`,
    name: "组件实践练习",
    component: () =>
        import( /* webpackChunkName: "about" */ `@/views/${name}/${name}.vue`)
}