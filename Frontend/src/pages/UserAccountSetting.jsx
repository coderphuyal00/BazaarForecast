import { React, useState, useContext, useEffect } from "react";
import IndexCard from "../partials/dashboard/IndexCard";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../icons";
import { Button, Input, Typography } from "@material-tailwind/react";
import AuthContext from "../components/context/AuthContext";
import EditUserInfoModal from "../components/EditUserInfoModal";
export default function UserAccountSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const { fullUserDetails, authTokens } = useContext(AuthContext);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (fullUserDetails) {
      setUserDetails(fullUserDetails);
      console.log(fullUserDetails);
    } else {
      setUserDetails("loading");
    }
  }, [fullUserDetails]);

  const handleSubmit = () => {};
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="grid grid-cols-12 gap-6 m-2">
          {/* <InfiniteScroll /> */}
        </div>
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Account
                </h1>
                <p className="text-gray-800/40 text-base mt-3 dark:text-gray-400">
                  Update your profile and personal details here
                </p>
              </div>

              {/* Right: Actions */}
            </div>

            {/* Cards */}
            <div className="col-span-full xl:col-span-7 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                    Profile
                  </h2>
                </div>
              </header>
              <div className="p-3">
                {/* Table */}

                <div className="overflow-x-auto">
                  <div className="p-2">
                    <h1 className="font-semibold text-base dark:text-gray-100 text-gray-800">
                      Avatar
                    </h1>
                    <div className="avatar rounded-xl border-1 border-gray-400/30 p-5 flex items-center justify-between mt-5">
                      {/* Basic Information */}
                      <div className=" flex flex-col gap-1 w-full p-2">
                        <div className="flex p-3 items-center justify-between w-full">
                          <div className=" overflow-hidden outline-3 outline-offset-1 outline-green-500 rounded-full dark:outline-green-500">
                            <img
                              src={`https://ui-avatars.com/api/?name=${userDetails?.first_name}+${userDetails?.last_name}&background=random`}
                              alt="user"
                            />
                          </div>
                          <div className="edit-button order-2">
                            <button
                              className={`flex w-full items-center cursor-pointer justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto ${
                                searchModalOpen &&
                                "bg-gray-200 dark:bg-gray-800"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchModalOpen(true);
                              }}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                  fill=""
                                />
                              </svg>
                              Edit
                            </button>
                            <EditUserInfoModal
                              id="edit-user-information"
                              modalOpen={searchModalOpen}
                              setModalOpen={setSearchModalOpen}
                              //   formData={userDetail}
                            />
                          </div>
                        </div>
                        <div className="name w-1/2 p-3 flex flex-col gap-2 font-bold text-l capitalize text-gray-900 dark:text-gray-100">
                          {/* {userDetails?.first_name} {userDetails?.last_name} */}
                          <div className="name flex items-center justify-between gap-2">
                            {/* First Name */}
                            <div class="w-full max-w-sm min-w-[200px] mb-5">
                              <label
                                htmlFor=""
                                className="text-xs text-gray-700 font-bold dark:text-white"
                              >
                                First Name
                              </label>
                              <div class="relative mt-2">
                                <input disabled 
                                  type="text"
                                  className="w-full pl-3 pr-3 py-2 font-semibold dark:text-white bg-transparent placeholder:text-slate-600 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                  value ={userDetails?.first_name}
                                />
                              </div>
                            </div>
                            {/* Last Name */}
                            <div class="w-full max-w-sm min-w-[200px] mb-5">
                              <label
                                htmlFor=""
                                className="text-xs text-gray-700 font-bold dark:text-white"
                              >
                                Last Name
                              </label>
                              <div class="relative mt-2">
                                <input disabled 
                                  type="text"
                                  className="w-full pl-3 pr-3 py-2 font-semibold dark:text-white bg-transparent placeholder:text-slate-600 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                  value={userDetails?.last_name}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="email w-full">
                            <div class="w-full max-w-sm min-w-[200px] mb-5">
                              <label
                                htmlFor=""
                                className="text-xs text-gray-700 font-bold dark:text-white"
                              >
                                Email
                              </label>
                              <div class="relative mt-2">
                                <input disabled 
                                  type="text"
                                  className="w-full pl-3 pr-3 py-2 font-semibold dark:text-white bg-transparent text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease shadow-sm "
                                  placeholder={userDetails?.email}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {/* Password Section */}
                    {/* <h3>Password</h3> */}
                    <h1 className="font-semibold text-base dark:text-gray-100 text-gray-800">
                      Password
                    </h1>
                    <div className="rounded-xl border-1 border-gray-400/30 p-5 flex flex-col justify-between mt-3">
                      <div class="w-full max-w-sm min-w-[200px] mb-5">
                        <label
                          htmlFor=""
                          className="text-xs text-gray-700 font-bold dark:text-white"
                        >
                          New Password{" "}
                        </label>
                        <div class=" mt-2 items-center flex flex-col">
                          <div className="input relative flex w-full flex-col">
                            <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full pl-3 pr-3 py-2 dark:text-white bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Enter new password"
                          />
                          <span
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                          >
                            {showNewPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                          </span>
                          </div>
                          <p class="flex items-start mt-2 text-xs text-slate-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              class="w-5 h-5 mr-1.5"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            Use at least 8 characters, one uppercase, one
                            lowercase and one number.
                          </p>
                        </div>
                      </div>
                      <div class="w-full max-w-sm min-w-[200px]">
                        <label
                          htmlFor=""
                          className="text-xs text-gray-700 font-bold dark:text-white"
                        >
                          Confirm New Password{" "}
                        </label>
                        <div class="relative mt-2 flex w-full flex-col">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full pl-3 pr-3 py-2 bg-transparent dark:text-white placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Re-type new password"
                          />
                          <span
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                          >
                            {showConfirmPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="border-t-1 border-gray-400/30 w-full mt-4"></div>
                      <div className="mt-3">
                        <button
                          className="flex items-center rounded-md border border-slate-300 py-1 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:hover:bg-gray-500 dark:text-white"
                          type="button"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <h1 className="font-semibold text-base dark:text-gray-100 text-gray-800">
                      Danger Zone
                    </h1>
                    <div className="rounded-xl bg-red-800/10 border-1 border-gray-400/30 p-5 flex flex-col justify-between mt-3">
                      <div className="alert flex justify-between items-center">
                        <div className="alert-text">
                          <h4 className="text-red-900 font-semibold text-sm">
                            Delete Account
                          </h4>
                          <p className="font-thin text-red-700 text-xs">
                            Permanently remove your account. This action is not
                            reversible.{" "}
                          </p>
                        </div>
                        <div className="delete-btn">
                          <div className="">
                            <button
                              className="flex items-center rounded-md border border-red-300 py-1 px-4 text-sm text-center text-sm transition-all font-semibold text-red-900 hover:bg-red-800/20"
                              type="button"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* <Banner />s */}
      </div>
    </div>
  );
}
