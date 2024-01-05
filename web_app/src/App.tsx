import { Navigate, Route, Routes } from "react-router-dom";

import { MainLayout } from "./layout/MainLayout";

// pages
import { BrandForm } from "./pages/BrandForm";
import { Brands } from "./pages/Brands";
import { PlaceForm } from "./pages/PlaceForm";
import { Places } from "./pages/Places";
import { ProductForm } from "./pages/ProductForm";
import { Products } from "./pages/Products";
import { ProviderForm } from "./pages/ProviderForm";
import { Providers } from "./pages/Providers";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
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
                        <BrandForm />
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

            {/* <Route
          path="/sales/form"
          element={
              <MainLayout title="Formulario de ventas">
                <SaleForm />
              </MainLayout>
          }
        />

        <Route
          path="/shopping/form"
          element={
              <MainLayout title="Formulario de compras">
                <ShoppingForm />
              </MainLayout>
          }
        /> */}

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

            {/* 
        <Route
          path="/sales"
          element={
              <MainLayout title="Ventas">
                <Sales />
              </MainLayout>
          }
        />

        <Route
          path="/shopping"
          element={
              <MainLayout title="Compras">
                <Shopping />
              </MainLayout>
          }
        /> */}

            <Route
                path="/brands"
                element={
                    <MainLayout title="Marcas">
                        <Brands />
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
                path="/cart"
                element={
                    <MainLayout title="Carrito">
                        <Cart />
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