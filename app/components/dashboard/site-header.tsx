import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Link } from "react-router";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-neutral-700/50 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-neutral-300 hover:text-white" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 bg-neutral-700/50"
        />
        <div className="flex-1 flex justify-end">
          <Link
            to="/demo"
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-3 py-1"
          >
            Demo
          </Link>
        </div>
      </div>
    </header>
  );
}