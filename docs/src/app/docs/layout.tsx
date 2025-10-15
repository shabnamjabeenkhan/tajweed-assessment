import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, aiTabEnabled } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { Rocket, Building, FileText, Brain } from 'lucide-react';
import { DocsSidebarBottom } from '@/components/docs-sidebar';
import WelcomeBanner from '@/components/WelcomeBanner';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <div className="relative">
      <WelcomeBanner />
      <DocsLayout
        tree={source.pageTree}
        {...baseOptions()}
        nav={{
          title: 'Accelerator',
          url: '/docs',
        }}
        sidebar={{
          tabs: [
            {
              title: 'Running a Tech Company',
              description: 'Every part of running a successful Tech Company',
              url: '/docs',
              icon: <Building />, // Rocket = company launch/growth, best Lucide fit for "Company/Building"
            },
            {
              title: 'Building Your Product',
              description: 'Build a product from 0 -> 1',
              url: '/docs/building-your-product',
              icon: <Rocket />,
            },
            aiTabEnabled
              ? {
                  title: 'AI Engineering',
                  description:
                    'Learn how to tastefully embed AI into your Product',
                  url: '/docs/ai',
                  icon: <Brain />,
                }
              : {
                  title: 'AI Engineering',
                  description: (
                    <span className="text-fd-muted-foreground">Coming soon</span>
                  ),
                  url: '/docs/ai',
                  icon: <Brain />,
                  props: {
                    'aria-disabled': true,
                    title: 'Coming soon',
                    className:
                      'cursor-not-allowed opacity-60 hover:bg-transparent hover:text-fd-muted-foreground',
                    href: '/docs',
                  },
                },
            {
              title: 'Project Documentation',
              description: 'Document your Idea, Decisions, and Technical Architecture',
              url: '/docs/project-documentation',
              icon: <FileText />,
            }
          ],
          footer: undefined,
        }}
      >
        {children}
      </DocsLayout>
      
      {/* Fixed bottom right content */}
      <div className="fixed bottom-4 right-4 z-50 bg-fd-background border border-fd-border rounded-lg shadow-lg">
        <DocsSidebarBottom />
      </div>
    </div>
  );
}
