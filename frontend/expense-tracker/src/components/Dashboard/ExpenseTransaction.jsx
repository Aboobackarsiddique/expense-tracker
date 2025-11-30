import React from "react";
import { LuArrowRight } from "react-icons/lu";
import { TransactionInfoCard } from "../Cards/TransactionInfoCard";
import moment from "moment";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg text-gray-800">Recent Expenses</h5>
                <button className="card-btn" onClick={onSeeMore}>
                    See All <LuArrowRight className="text-base" />
                </button>
            </div>

            <div className="mt-6">
                {(!transactions || transactions.length === 0) ? (
                    <p className="text-sm text-gray-500">No expenses found in the last 30 days.</p>
                ) : (
                    transactions.slice(0, 5).map((expense) => (
                        <TransactionInfoCard
                            key={expense._id}
                            title={expense.category}
                            icon={expense.icon}
                            date={moment(expense.date).format("Do MMM YYYY")}
                            amount={expense.amount}
                            type="expense"
                            hideDeleteBtn
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ExpenseTransactions;
