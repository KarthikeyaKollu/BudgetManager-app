import React from 'react';
import PieChartComponent from '@/components/PieChartComponent'

const MonthlyExpenseCard = ({summary}) => {

    const legendItems = [
        { color: '#27ae60', label: 'Essentials', amount: summary.essentials||0 },
        { color: '#f2c94c', label: 'Non-Essentials', amount: summary.nonEssentials||0 },
        { color: '#bfc5d4', label: 'Miscellaneous', amount: summary.miscellaneous||0 },
    ];

    return (
        <div className="w-[654px] h-[355px]  p-6  bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="text-lg font-bold text-black mb-4 ">This month</div>

            <div className="flex   items-center gap-[74px] justify-center">
                {/* Main Component and Circles Section */}
                <div className="relative  flex justify-center items-center">
                   
                        <PieChartComponent percentages={[summary.essentialPercent,summary. nonEssentialPercent,summary.miscellaneousPercent]} />

                </div>

                {/* Legend Section */}
                <div className="flex flex-col gap-4">
                    {legendItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-6">
                            <div
                                className="w-8 h-8 rounded-md"
                                style={{ backgroundColor: item.color }}
                            />
                            <div>
                                <div className="text-xs font-normal text-[#8695b6]">
                                    {item.label}
                                </div>
                                <div className="text-base font-medium text-[#5f6f92]">
                                ₹{item.amount}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default MonthlyExpenseCard;
