/**
 * FILE: App.tsx
 * PURPOSE: Root app component — sets up routing, query client, and global providers.
 * WHY: Centralizes all providers and route declarations in one place.
 */

import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QuizProvider } from "./context/QuizContext";
import { QuizRoot } from "./pages/QuizRoot";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={AdminPage} />
      <Route path="/*?" component={QuizRoot} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuizProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </QuizProvider>
    </QueryClientProvider>
  );
}

export default App;
