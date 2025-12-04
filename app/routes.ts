import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    layout("layout/index.tsx", [
        index("routes/home.tsx"),
        route("cart", "routes/cart.tsx"),
        route("checkout", "routes/checkout.tsx"),
        ...prefix("product", [
            route(":id", "routes/productDetails.tsx"),
        ]),
    ]),
] satisfies RouteConfig;
