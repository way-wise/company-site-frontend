import { ProfileDropdown } from "../shared/header/profile-dropdown";
import SidebarToggle from "../shared/header/sidebar-toggle";

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6 dark:bg-card">
      <div className="flex items-center gap-4">
        <SidebarToggle />
      </div>
      <div className="flex items-center gap-4">
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
