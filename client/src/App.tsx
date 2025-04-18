import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

function Router() {
  const AboutPage = React.lazy(() => import('./pages/about'));

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">جاري التحميل...</div>}>
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/about" component={AboutPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;