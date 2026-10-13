import { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/site/Layout";
import Home from "./pages/Home";

/* Route-level splitting: Home stays in the critical bundle; every other route
   loads on demand. Toaster/TooltipProvider were removed — no toast() call and
   no <Tooltip> exist anywhere in the app (verified), so this drops sonner,
   next-themes and @radix-ui tooltip/popper from the homepage bundle. */
const Work = lazy(() => import("./pages/Work"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
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
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <Layout>
          <Router />
        </Layout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
