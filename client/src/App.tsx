import { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/site/Layout";
import Home from "./pages/Home";

/* Marketing — unchanged behaviour, route-level splitting. */
const Work = lazy(() => import("./pages/Work"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Services = lazy(() => import("./pages/Services"));
const Offers = lazy(() => import("./pages/Offers"));
const OfferDetail = lazy(() => import("./pages/OfferDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FreeReview = lazy(() => import("./pages/FreeReview"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* Client operations — client portal, administrator dashboard, auth. */
const Login = lazy(() => import("./pages/Login"));
const PortalHome = lazy(() => import("./pages/portal/Home"));
const PortalProject = lazy(() => import("./pages/portal/Project"));
const AdminHome = lazy(() => import("./pages/admin/Home"));
const AdminProjects = lazy(() => import("./pages/admin/Projects"));
const AdminProject = lazy(() => import("./pages/admin/Project"));
const AdminClients = lazy(() => import("./pages/admin/Clients"));
const AdminTemplates = lazy(() => import("./pages/admin/Templates"));
const AdminAutomation = lazy(() => import("./pages/admin/Automation"));

function Marketing() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects" component={Work} />
        <Route path="/projects/:slug" component={CaseStudy} />
        {/* legacy /work URLs keep working */}
        <Route path="/work"><Redirect to="/projects" /></Route>
        <Route path="/work/:slug">{(p) => <Redirect to={`/projects/${p.slug}`} />}</Route>
        <Route path="/services" component={Services} />
        <Route path="/offers" component={Offers} />
        <Route path="/offers/:slug" component={OfferDetail} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/free-review" component={FreeReview} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <Suspense fallback={null}>
          <Switch>
            {/* Ops screens use their own shell, not the marketing header/footer. */}
            <Route path="/login" component={Login} />
            <Route path="/portal" component={PortalHome} />
            <Route path="/portal/projects/:id" component={PortalProject} />
            <Route path="/admin" component={AdminHome} />
            <Route path="/admin/projects" component={AdminProjects} />
            <Route path="/admin/projects/:id" component={AdminProject} />
            <Route path="/admin/clients" component={AdminClients} />
            <Route path="/admin/templates" component={AdminTemplates} />
            <Route path="/admin/automation" component={AdminAutomation} />
            <Route>
              <Layout>
                <Marketing />
              </Layout>
            </Route>
          </Switch>
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
