import React from 'react';
import { Calendar } from '../../components/ui/calendar';

function CalenderLayout() {


  return (
    <div className="p-5 flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl h-96">
     <Calendar/>
    </div>
  );
}

export default CalenderLayout;
