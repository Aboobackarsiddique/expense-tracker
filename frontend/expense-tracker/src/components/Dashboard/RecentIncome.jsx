import moment from "moment";
import { LuArrowRight } from "react-icons/lu";
import { TransactionInfoCard } from "../Cards/TransactionInfoCard";

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg text-gray-800">Recent Income</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {(!transactions || transactions.length === 0) ? (
          <p className="text-sm text-gray-500">No income found.</p>
        ) : (
          transactions.slice(0, 5).map((item) => (
            <TransactionInfoCard
              key={item._id}
              title={item.source || item.category || 'Income'}
              icon={item.icon}
              date={moment(item.date).format("Do MMM YYYY")}
              amount={item.amount}
              type="income"
              hideDeleteBtn
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentIncome;
