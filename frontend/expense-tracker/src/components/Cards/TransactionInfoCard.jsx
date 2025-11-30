import React from 'react'
import {
    LuUtensils,
    LuTrendingDown,
    LuTrendingUp,
    LuTrash2
} from 'react-icons/lu'

export const TransactionInfoCard = ({
    onDelete = () => {},
    title,
    icon,
    date,
    amount,
    type = 'expense',
    hideDeleteBtn,
}) => {
    const getAmountStyles = () => type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600';
    const displayTitle = title || 'Untitled';
    const displayDate = date || 'Unknown date';
    const displayAmount = (typeof amount === 'number') ? amount : (Number(amount) || 0);
  return (
    <div className='group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60 transition-colors'>
    <div className='w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full'>
    {icon ? (
         // Check if icon is an emoji (single character) or an image URL
         icon.length <= 2 ? (
           <span className='text-2xl'>{icon}</span>
         ) : (
           <img src={icon} alt={title} className='w-6 h-6' />
         )
         ) : (
             <LuUtensils />
        )}
        </div>
        <div className='flex-1 flex items-center justify-between'>
            <div>
                    <p className='text-sm text-gray-700 font-medium'>{displayTitle}</p>
                    <p className='text-xs text-gray-400 mt-1'>{displayDate}</p>
            </div>
            <div className='flex items-center gap-2'>
                {!hideDeleteBtn && (
                    <button className='text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
                    onClick={onDelete}
                    ><LuTrash2 size={18} /></button>
                )}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
                    <h6 className='text-xs font-medium'>{type === "income" ? '+' : '-'} ₹{displayAmount}</h6>
                    {type === 'income' ? <LuTrendingUp /> : <LuTrendingDown />}
                </div>
            </div>
        </div>
        </div>
    );
};
