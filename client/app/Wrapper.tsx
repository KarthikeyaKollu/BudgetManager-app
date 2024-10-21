"use client"
import TransactionList from "@/app/ui/TransactionComponents/TransactionList";
import BarChart from "./ui/BarChart/BarChart";
import PieChart from "./ui/PieCharts/PieChart";
import Header from "./ui/Header/Header";
import Add from './ui/AddExpense/Add'
import { Provider } from 'react-redux';
import store from "@/redux/store";


export const weeklyChartData = [
  {
    date: "5th Mar",
    values: [1780, 800, 980],
  },
  {
    date: "6th Mar",
    values: [499, 199, 300],
  },
  {
    date: "7th Mar",
    values: [1780, 800, 980],
  },
  {
    date: "8th Mar",
    values: [1780, 800, 980],
  },
  {
    date: "9th Mar",
    values: [1780, 800, 980],
  },
  {
    date: "Yesterday",
    values: [], // Provide an empty array for consistency.
  },
];


export default function Wrapper() {

  return (

      <Provider store={store}>
        <div className="">
          <main className="">
            <div className="flex flex-col items-center">
              <div className="w-[1134px] relative"> {/* This keeps the content in the specified width */}
                {/* Header */}
                <Header />
                {/* Main Content */}
                <div className="w-full px-4 py-4">
                  <div className="grid grid-cols-2 gap-[300px]">
                    {/* First Column */}
                    <div className="space-y-[64px]">
                      <PieChart />
                      <BarChart />
                    </div>

                    {/* Second Column */}
                    <div className="space-y-[64px]">
                      <TransactionList />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Add Button */}
              <Add />
            </div>
          </main>
        </div>
      </Provider>

  );
}

