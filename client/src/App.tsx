import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Contest from "@/pages/Contest";
import { Route, Switch, useLocation } from "wouter";
import AiConsultWidget from "./components/AiConsultWidget";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import PerformanceSchedule from "./pages/PerformanceSchedule";
import AiScript from "./pages/AiScript";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/contest"} component={Contest} />
      <Route path={"/schedule"} component={Schedule} />
      <Route path={"/performance-schedule"} component={PerformanceSchedule} />
      <Route path={"/ai-script"} component={AiScript} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAiScript = location === "/ai-script";
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          {!isAiScript && <AiConsultWidget bottomOffset={88} showAfterScroll />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
