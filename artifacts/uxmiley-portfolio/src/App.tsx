import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

// Pages
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';

// Admin Pages
import { AdminLayout } from '@/pages/admin/admin-layout';
import AdminDashboard from '@/pages/admin/admin-dashboard';
import AdminHero from '@/pages/admin/admin-hero';
import AdminAbout from '@/pages/admin/admin-about';
import AdminSkills from '@/pages/admin/admin-skills';
import AdminProjects from '@/pages/admin/admin-projects';
import AdminExperience from '@/pages/admin/admin-experience';
import AdminTestimonials from '@/pages/admin/admin-testimonials';
import AdminArticles from '@/pages/admin/admin-articles';
import AdminContact from '@/pages/admin/admin-contact';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/hero">
        <AdminLayout>
          <AdminHero />
        </AdminLayout>
      </Route>
      <Route path="/admin/about">
        <AdminLayout>
          <AdminAbout />
        </AdminLayout>
      </Route>
      <Route path="/admin/skills">
        <AdminLayout>
          <AdminSkills />
        </AdminLayout>
      </Route>
      <Route path="/admin/projects">
        <AdminLayout>
          <AdminProjects />
        </AdminLayout>
      </Route>
      <Route path="/admin/experience">
        <AdminLayout>
          <AdminExperience />
        </AdminLayout>
      </Route>
      <Route path="/admin/testimonials">
        <AdminLayout>
          <AdminTestimonials />
        </AdminLayout>
      </Route>
      <Route path="/admin/articles">
        <AdminLayout>
          <AdminArticles />
        </AdminLayout>
      </Route>
      <Route path="/admin/contact">
        <AdminLayout>
          <AdminContact />
        </AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
