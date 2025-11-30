export const BASE_URL = "https://expense-tracker-backend-3b3e.onrender.com"

// utils/apiPath.js
export const API_PATH = {
    AUTH: {
        LOGIN : "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: "/api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_ALL_INCOMES: "/api/v1/income/get",
        DELETE_INCOME: (incomeId) => `/api/v1/income/delete/${incomeId}`,
        UPLOAD_IMAGE:"/api/v1/income/delete",
        DOWNLOAD_INCOME_EXCEL: `/api/v1/income/downloadExcel`,
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/v1/expense/add",
        GET_ALL_EXPENSES: "/api/v1/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/delete/${expenseId}`,
        DOWNLOAD_EXPENSE_EXCEL: `/api/v1/expense/downloadExcel`,
    },
    GOAL: {
        CREATE_GOAL: "/api/v1/goal/create",
        GET_ALL_GOALS: "/api/v1/goal/get",
        UPDATE_GOAL: (goalId) => `/api/v1/goal/update/${goalId}`,
        DELETE_GOAL: (goalId) => `/api/v1/goal/delete/${goalId}`,
        GET_GOAL_PROGRESS: "/api/v1/goal/progress",
    },
    BUDGET: {
        CREATE_BUDGET: "/api/v1/budget/create",
        GET_BUDGETS: "/api/v1/budget/get",
        UPDATE_BUDGET: (budgetId) => `/api/v1/budget/update/${budgetId}`,
        DELETE_BUDGET: (budgetId) => `/api/v1/budget/delete/${budgetId}`,
    },
    RECURRING: {
        CREATE_RECURRING: "/api/v1/recurring/create",
        GET_RECURRING: "/api/v1/recurring/get",
        UPDATE_RECURRING: (recurringId) => `/api/v1/recurring/update/${recurringId}`,
        DELETE_RECURRING: (recurringId) => `/api/v1/recurring/delete/${recurringId}`,
    },
    IMAGE: {
        UPLOAD: "/api/v1/auth/upload-image",
    },
}
