import { Navigate, Route, Routes } from "react-router-dom";

import { MainLayout } from "./layout/MainLayout";

// pages
import { Brands } from "./pages/Brands";
import { PlaceForm } from "./pages/PlaceForm";
import { Places } from "./pages/Places";
import { ProductForm } from "./pages/ProductForm";
import { Products } from "./pages/Products";
import { ProviderForm } from "./pages/ProviderForm";
import { Providers } from "./pages/Providers";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Proformas } from "./pages/Proformas";
import { SaleConfirmation } from "./pages/SaleConfirmation";
import { TypeProducts } from "./pages/TypeProducts";
import { TypeProductForm } from "./pages/TypeProductForm";
// import { Sales } from "./pages/Sales";
// import { Shopping } from "./pages/Shopping";
// import { SaleForm } from "./pages/SaleForm";
// import { ShoppingForm } from "./pages/ShoppingForm";

const App = () => {
    return (
        <Routes>

            <Route
                path="/products/form"
                element={
                    <MainLayout title="Formulario de productos">
                        <ProductForm />
                    </MainLayout>
                }
            />

            <Route
                path="/brands/form"
                element={
                    <MainLayout title="Formulario de marcas">
                        <TypeProductForm />
                    </MainLayout>
                }
            />

            <Route
                path="/type-products/form"
                element={
                    <MainLayout title="Formulario de tipo de producto">
                        <TypeProductForm />
                    </MainLayout>
                }
            />

            <Route
                path="/places/form"
                element={
                    <MainLayout title="Formulario de lugares">
                        <PlaceForm />
                    </MainLayout>
                }
            />

            <Route
                path="/providers/form"
                element={
                    <MainLayout title="Formulario de proveedores">
                        <ProviderForm />
                    </MainLayout>
                }
            />

            <Route
                path="/products"
                element={
                    <MainLayout title="Productos">
                        <Products />
                    </MainLayout>
                }
            />

            <Route
                path="/products/detail"
                element={
                    <MainLayout title="Detalle del producto">
                        <ProductDetail />
                    </MainLayout>
                }
            />

            <Route
                path="/brands"
                element={
                    <MainLayout title="Marcas">
                        <Brands />
                    </MainLayout>
                }
            />

            <Route
                path="/type-products"
                element={
                    <MainLayout title="Tipos de Productos">
                        <TypeProducts />
                    </MainLayout>
                }
            />


            <Route
                path="/places"
                element={
                    <MainLayout title="Lugares">
                        <Places />
                    </MainLayout>
                }
            />

            <Route
                path="/providers"
                element={
                    <MainLayout title="Proveedores">
                        <Providers />
                    </MainLayout>
                }
            />

            <Route
                path="/proform"
                element={
                    <MainLayout title="Proformas">
                        <Proformas />
                    </MainLayout>
                }
            />

            <Route
                path="/cart"
                element={
                    <MainLayout title="Carrito">
                        <Cart />
                    </MainLayout>
                }
            />

            <Route
                path="/sale"
                element={
                    <MainLayout title="Venta">
                        <SaleConfirmation />
                    </MainLayout>
                }
            />

            <Route
                path="/"
                element={<Navigate to="/products" replace />}
            />

        </Routes>
    );
};

export default App;