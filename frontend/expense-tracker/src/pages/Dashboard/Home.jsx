import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUSerAuth } from '../../hooks/useUSerAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import InfoCard from '../../components/Cards/InfoCard';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import { addThousandsSeperator } from '../../utils/helper';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransaction';
import Last30DaysExpenses from '../../components/Dashboard/last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {
  useUSerAuth();

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.DASHBOARD.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong, Please try again later", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeperator(dashboardData?.totalBalance || 0)} 
            // ✅ Added optional chaining (dashboardData?.) to avoid null errors
            color="bg-emerald-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeperator(dashboardData?.totalIncome || 0)} 
            // ✅ Same fix: optional chaining for safety
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeperator(dashboardData?.totalExpense || 0)} 
            // ✅ Same fix: optional chaining for safety
            color="bg-red-500"
          />
        </div> 

        {/* ❌ Original had 'grid grid cols-1' (invalid Tailwind) */}
        {/* ✅ Fixed to 'grid grid-cols-1' */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         <RecentTransactions
            transaction={dashboardData?.recentTransactions || []} 
            // ❌ Original fallback was "" (string) → breaks if component expects array
            // ✅ Changed fallback to [] (empty array) → safe for mapping
            onSeeMore={() => navigate("/expense")}
          />
          <FinanceOverview
          totalBalance={dashboardData?.totalBalance || 0}
          totalIncome={dashboardData?.totalIncome || 0}
          totalExpense={dashboardData?.totalExpense || 0}
          /> 
          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={()=> navigate("/expense")} />
          <Last30DaysExpenses
          data={dashboardData?.last30DaysExpenses?.transactions || []}
          />
          <RecentIncomeWithChart
          data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
          totalIncome={dashboardData?.totalIncome || 0}
          />
          <RecentIncome
          transactions={dashboardData?.last60DaysIncome?.transactions || []}
          onSeeMore={()=> navigate("/income")} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
