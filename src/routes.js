// @material-ui/icons
import React, { Suspense, Fragment, lazy } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import LoadingScreen from "./components/Common/LoadingScreen";
import AuthGuard from "./components/Common/AuthGuard";

import GuestGuard from "./components/Common/GuestGuard";
import DashboardLayout from "../src/layouts/DashboardLayout";
import DashboardGuardia from "../src/layouts/DashboardGuardia";
import DashboardAdmin from "../src/layouts/DashboardAdmin";

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: "/404",
    component: lazy(() => import("./views/errors/NotFoundView")),
  },
  {
    exact: true,
    guard: GuestGuard,
    path: "/",
    component: lazy(() => import("./views/login")),
  },

  {
    path: "/superAdmin",
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: "/superAdmin/dashboard",
        component: lazy(() => import("./views/dashboard")),
      },
      {
        exact: true,
        path: "/superAdmin/conjuntos",
        component: lazy(() => import("./views/conjuntos/conjuntos")),
      },
      {
        exact: true,
        path: "/superAdmin/administradores",
        component: lazy(() => import("./views/administradores/administrador")),
      },
      {
        exact: true,
        path: [
          "/superAdmin/conjuntos/newuser",
          "/superAdmin/conjuntos/newuser/:threadKey",
        ],
        component: lazy(() =>
          import("./views/usuarios/AddUsersConjunto/AddUsersConjunto")
        ),
      },
      {
        exact: true,
        path: [
          "/superAdmin/conjuntos/areas",
          "/superAdmin/conjuntos/areas/:threadKey",
        ],
        component: lazy(() => import("./views/areasComunales/areascomunales")),
      },
      {
        exact: true,
        path: [
          "/superAdmin/conjuntos/cargardatos",
          "/superAdmin/conjuntos/cargardatos/:threadKey",
        ],
        component: lazy(() => import("./views/datosIniciales/index")),
      },

      {
        exact: true,
        path: "/superAdmin/splash",
        component: lazy(() => import("./views/viewSuperAdministrador/Splash/Splash")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: "/administrador",
    guard: AuthGuard,
    layout: DashboardAdmin,
    routes: [
      {
        exact: true,
        path: "/administrador/dashboard",
        component: lazy(() => import("./views/dashboardAdmin")),
      },
      {
        exact: true,
        path: "/administrador/presupuestar",
        component: lazy(() => import("./views/presupuestar/listado")),
      },
      {
        exact: true,
        path: "/administrador/presupuestar/new",
        component: lazy(() => import("./views/presupuestar/New/New")),
      },
      {
        exact: true,
        path: "/administrador/presupuestar/view/:threadKey",
        component: lazy(() => import("./views/presupuestar/Ver/ver")),
      },
      {
        exact: true,
        path: "/administrador/conjuntos",
        component: lazy(() =>
          import("./views/viewAdministrador/reservaAreasComunales")
        ),
      },
      {
        exact: true,
        path: "/administrador/reservas/reserva/:threadKey",
        component: lazy(() => import("./views/viewAdministrador/reservaAreasComunales/createReserva/createReserva")),
      },
      {
        exact: true,
        path: "/administrador/reservas/ver/:threadKey",
        component: lazy(() => import("./views/viewAdministrador/reservaAreasComunales/viewReservas/viewReservas")),
      },
      {
        exact: true,
        path: "/administrador/reservasxaprobar",
        component: lazy(() => import("./views/viewAdministrador/reservaAreasComunales/reservasxaprobar")),
      },
      {
        exact: true,
        path: "/administrador/presupuestar/validar/:threadKey",
        component: lazy(() => import("./views/presupuestar/Validar/Validar")),
      },
      {
        exact: true,
        path: "/administrador/residente",
        component: lazy(() => import("./views/viewAdministrador/residente")),
      },
      {
        exact: true,
        path: "/administrador/proveedores",
        component: lazy(() =>
          import("./views/viewAdministrador/proveedores/Proveedor")
        ),
      },
      {
        exact: true,
        path: "/administrador/proveedores/cuentasporpagar",
        component: lazy(() =>
          import("./views/viewAdministrador/proveedores/PagosAndPedidos/Pagos")
        ),
      },
      {
        exact: true,
        path: "/administrador/conciliaciones",
        component: lazy(() => import("./views/viewAdministrador/conciliacion")),
      },
      {
        exact: true,
        path: "/administrador/conciliaciones/detalle/:threadKey",
        component: lazy(() => import("./views/viewAdministrador/conciliacion/Detalle/Detalle")),
      },
     
      {
        exact: true,
        path: "/administrador/cuentasBancarias",
        component: lazy(() =>
          import("./views/viewAdministrador/metodosDePago/cuentasBancarias")
        ),
      },
      {
        exact: true,
        path: "/administrador/cajas",
        component: lazy(() =>
          import("./views/viewAdministrador/metodosDePago/cajas")
        ),
      },
      {
        exact: true,
        path: "/administrador/rubros/rubrosIngresos",
        component: lazy(() =>
          import("./views/viewAdministrador/rubros/RubrosIngresos")
        ),
      },
      {
        exact: true,
        path: "/administrador/rubros/rubrosEgresos",
        component: lazy(() =>
          import("./views/viewAdministrador/rubros/RubrosEgresos")
        ),
      },
      {
        exact: true,
        path: "/administrador/ingresosNoIdentificados",
        component: lazy(() => import("./views/viewAdministrador/IngresosSinIdentificar")),
      },
      {
        exact: true,
        path: "/administrador/ingresos",
        component: lazy(() => import("./views/viewAdministrador/ingresos")),
      },
      {
        exact: true,
        path: "/administrador/egresos",
        component: lazy(() => import("./views/viewAdministrador/egresos")),
      },
      {
        exact: true,
        path: "/administrador/transferenciasporaprobar",
        component: lazy(() =>
          import("./views/viewAdministrador/aprobacionDePagos")
        ),
      },
      {
        exact: true,
        path: "/administrador/reportes/ingvsegr",
        component: lazy(() => import("./views/viewAdministrador/reportes/ingVsEgr")),
      },
      {
        exact: true,
        path: "/administrador/reportes/cartera",
        component: lazy(() => import("./views/viewAdministrador/reportes/cartera")),
      },
      {
        exact: true,
        path: "/administrador/reportes/carteraUsuario",
        component: lazy(() => import("./views/viewAdministrador/reportes/carteraPorUsuario")),
      },
      {
        exact: true,
        path: "/administrador/reportes/consolidado",
        component: lazy(() => import("./views/viewAdministrador/reportes/consolidado")),
      },
      {
        exact: true,
        path: "/administrador/informeProblemas",
        component: lazy(() => import("./views/viewAdministrador/issuesReport")),
      },
      {
        exact: true,
        path: "/administrador/mantenimiento",
        component: lazy(() => import("./views/viewAdministrador/mantenimiento")),
      },
      {
        exact: true,
        path: "/administrador/votacion",
        component: lazy(() => import("./views/viewAdministrador/votacion")),
      },
      {
        exact: true,
        path: "/administrador/notificaciones",
        component: lazy(() => import("./views/viewAdministrador/notificaciones")),
      },
      
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: "/guardia",
    guard: AuthGuard,
    layout: DashboardGuardia,
    routes: [
      {
        exact: true,
        path: "/guardia/dashboard",
        component: lazy(() => import("./views/viewGuardia/dashboard/index")),
      },
      {
        exact: true,
        path: "/guardia/alerta",
        component: lazy(() => import("./views/viewGuardia/alertas")),
      },
      {
        exact: true,
        path: "/guardia/bitacoraDigital",
        component: lazy(() => import("./views/viewGuardia/bitacoraDigital/ListBitacora/ListarBitacora")),
      },
      {
        exact: true,
        path: "/guardia/visitasAnticipadas",
        component: lazy(() => import("./views/viewGuardia/visitasAnticipadas/index")),
      },
      {
        exact: true,
        path: "/guardia/ingresos",
        component: lazy(() => import("./views/viewGuardia/ingresos")),
      },
      {
        exact: true,
        path: "/guardia/eventos",
        component: lazy(() => import("./views/viewGuardia/eventos")),
      },
      {
        exact: true,
        path: "/guardia/rondas",
        component: lazy(() => import("./views/viewGuardia/rondas")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

export default routes;
