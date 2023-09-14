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
import { Sales } from "./pages/Sales";
import { Shopping } from "./pages/Shopping";
import { SaleForm } from "./pages/SaleForm";
import { ShoppingForm } from "./pages/ShoppingForm";

const App = () => {
  return (
      <Routes>

        <Route
          path="/wa/products/form"
          element={
              <MainLayout title="Formulario de productos">
                <ProductForm />
              </MainLayout>
          }
        />

        <Route
          path="/wa/brands/form"
          element={
              <MainLayout title="Formulario de marcas">
                <BrandForm />
              </MainLayout>
          }
        />

        <Route
          path="/wa/places/form"
          element={
              <MainLayout title="Formulario de lugares">
                <PlaceForm />
              </MainLayout>
          }
        />

        <Route
          path="/wa/providers/form"
          element={
              <MainLayout title="Formulario de proveedores">
                <ProviderForm />
              </MainLayout>
          }
        />

        <Route
          path="/wa/sales/form"
          element={
              <MainLayout title="Formulario de ventas">
                <SaleForm />
              </MainLayout>
          }
        />

        <Route
          path="/wa/shopping/form"
          element={
              <MainLayout title="Formulario de compras">
                <ShoppingForm />
              </MainLayout>
          }
        />

        <Route
          path="/wa/products"
          element={
              <MainLayout title="Productos">
                <Products />
              </MainLayout>
          }
        />

        <Route
          path="/wa/sales"
          element={
              <MainLayout title="Ventas">
                <Sales />
              </MainLayout>
          }
        />

        <Route
          path="/wa/shopping"
          element={
              <MainLayout title="Compras">
                <Shopping />
              </MainLayout>
          }
        />

        <Route
          path="/wa/brands"
          element={
              <MainLayout title="Marcas">
                <Brands />
              </MainLayout>
          }
        />

        <Route
          path="/wa/places"
          element={
              <MainLayout title="Lugares">
                <Places />
              </MainLayout>
          }
        />

        <Route
          path="/wa/providers"
          element={
              <MainLayout title="Proveedores">
                <Providers />
              </MainLayout>
          }
        />

        <Route
          path="/wa/"
          element={<Navigate to="/wa/products" replace />}
        />

      </Routes>
  );
};

export default App;