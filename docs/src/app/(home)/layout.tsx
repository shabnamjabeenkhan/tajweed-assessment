import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import AuthNav from '@/components/AuthNav';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={[
        {
          type: 'custom',
          on: 'nav',
          secondary: true,
          children: <AuthNav />,
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
