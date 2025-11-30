import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
    LuPiggyBank,
    LuRepeat,
    LuSettings,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense",
    },
    {
        id: "04",
        label: "Budgets",
        icon: LuPiggyBank,
        path: "/budgets",
    },
    {
        id: "05",
        label: "Recurring",
        icon: LuRepeat,
        path: "/recurring",
    },
    {
        id: "06",
        label: "Settings",
        icon: LuSettings,
        path: "/settings",
    },
    {
        id: "07",
        label: "Logout",
        icon: LuLogOut,
        path: "/logout",

    }
]