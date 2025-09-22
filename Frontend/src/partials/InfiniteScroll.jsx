import DashboardCard01 from "./dashboard/DashboardCard01";
import DashboardCard02 from "./dashboard/DashboardCard02";
import DashboardCard03 from "./dashboard/DashboardCard03";
export default function InfiniteScroll() {
  return (
    <div className="grid grid-cols-12 col-span-4 bg-white dark:bg-gray-800 ">
      <div
          className="animate-slideLeft whitespace-nowrap "
        // example width
      >
        <div className=" flex flex-row items-center justify-center w-48 h-48 m-2 gap-2 ">
          <div className="card  w-48 h-48 ">1</div>
          <div className="card w-full h-full">2</div>
          <div className="card w-full h-full">3</div>
          <div className="card w-full h-full">4</div>
          <div className="card w-full h-full">5</div>
          <div className="card w-full h-full">6</div>
          <div className="card w-full h-full">7</div>
          <div className="card w-full h-full">8</div>
          <div className="card w-full h-full">9</div>
        </div>
      </div>
    </div>
  );
}
