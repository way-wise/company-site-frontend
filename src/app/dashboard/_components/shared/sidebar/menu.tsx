import LogoutButton from "@/components/auth/LogoutButton";
import {
	CassetteTape,
	Dumbbell,
	FileQuestionMarkIcon,
	Home,
	Key,
	LayoutGrid,
	ListCheck,
	Play,
	Shield,
	UsersRound,
} from "lucide-react";
import MenuCollapsible from "./menu-collapsible";
import MenuCollapsibleItem from "./menu-collapsible-item";
import MenuItem from "./menu-item";

const SidebarMenu = () => {
	const menuList = [
		{
			title: "Dashboard",
			icon: <LayoutGrid className="icon" />,
			url: "/admin",
		},
		{
			title: "Users",
			icon: <UsersRound className="icon" />,
			url: "/admin/users",
		},
		{
			title: "Roles",
			icon: <Shield className="icon" />,
			url: "/admin/roles",
		},
		{
			title: "Permissions",
			icon: <Key className="icon" />,
			url: "/admin/permissions",
		},
		{
			title: "Projects",
			icon: <Dumbbell className="icon" />,
			url: "/admin/projects",
		},
		{
			title: "Services",
			icon: <CassetteTape className="icon" />,
			url: "/admin/service",
		},
		{
			title: "Tasks",
			icon: <ListCheck className="icon" />,
			url: "/admin/tasks",
		},
		{
			title: "FAQs",
			icon: <FileQuestionMarkIcon className="icon" />,
			url: "/admin/faqs",
		},
		{
			title: "Demo",
			icon: <Play className="icon" />,
			baseUrl: "/admin/clients-list",
			submenu: [
				{
					title: "Projects List",
					url: "/admin/clients-list",
				},
				{
					title: "Clients List",
					url: "/admin/clients-list",
				},
			],
		},
	];

	return (
		<nav className="grow space-y-1.5 overflow-y-auto p-6">
			{menuList.map((menu, index) => {
				if (menu.submenu) {
					return (
						<MenuCollapsible key={index} {...menu}>
							{menu.submenu.map((submenu, index) => (
								<MenuCollapsibleItem key={index} {...submenu} />
							))}
						</MenuCollapsible>
					);
				}

				return <MenuItem key={index} {...menu} />;
			})}
			<br />
			<hr />
			<br />
			<LogoutButton />
		</nav>
	);
};

export default SidebarMenu;
