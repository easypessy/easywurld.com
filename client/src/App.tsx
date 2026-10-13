import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/site/Layout";
import Home from "./pages/Home";
import Work from "./pages/Work";
import CaseStudy from "./pages/CaseStudy";
import Services from "./pages/Services";
import Offers from "./pages/Offers";
import OfferDetail from "./pages/OfferDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";

function Router() {
  return (
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
