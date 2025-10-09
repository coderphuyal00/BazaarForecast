import React, { useRef, useEffect, useContext, useState } from "react";
import Transition from "../utils/Transition";
import { CloseIcon } from "../icons";
import useLocalStorage from "./LocalStorageHandler";
import { Button, Input, Label } from "@material-tailwind/react";
import AuthContext from "./context/AuthContext";
// import fetchStocks from '../pages/StockDetails'
function EditUserInfoModal({
  id,
  searchId,
  modalOpen,
  setModalOpen,
  formData,
}) {
  const modalContent = useRef(null);
  const { authTokens } = useContext(AuthContext);
  const [userDetail, setUserDetail] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });
  useEffect(() => {
    if (formData) {
      setUserDetail({
        id: formData.id,
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
        username: formData.username,
      });
    } else {
      // Reset form for add mode
      setUserDetail({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        username: "",
      });
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePostData = async (e) => {
    e.preventDefault();
    let formD = new FormData();

    formD.set("first_name", userDetail.firstName);
    formD.set("last_name", userDetail.lastName);
    formD.set("email", userDetail.email);
    formD.set("username", userDetail.email);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/${userDetail.id}/detail/update/`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + authTokens?.access,
          },
          body: formD,
        }
      );
      const result = await response.json();
      console.log(result);
      // try {
      //   const data = JSON.parse(result);
      //   console.log("Parsed JSON data:", data);
      // } catch (err) {
      //   console.error("JSON parse error:", err);
      // }
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }
      // console.log("Form submitted successfully:", result);
      window.location.reload();
      // console.log(formD);
    } catch (error) {
      console.error("Submission error:", error.message);
    }
    const formObject = Object.fromEntries(formD.entries());
    console.log(formObject);
  };
  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setInputValue("");
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
  // close if the enter key is pressed
  useEffect(() => {
    const keyHandler = ({ key }) => {
      if (!modalOpen || key !== "Enter") return;
      setInputValue("");
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-gray-900/30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-0 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        {/* <div
          
          className="bg-white flex justify-between dark:bg-gray-800 border border-transparent dark:border-gray-700/60 overflow-auto max-w-2xl w-ful max-h-full rounded-lg shadow-lg"
        > */}
        {/* Search form */}

        <div className="items-center justify-between" ref={modalContent}>
          <div className="max-w-[700px] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
              <div className="px-2 pr-14 relative">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Edit Personal Information
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                  Update your details to keep your profile up-to-date.
                </p>
                <button
                  title="Close"
                  className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-300/50  dark:lg:hover:bg-gray-700/50 rounded-full ml-3 absolute top-0 right-0`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen(false);
                  }}
                  aria-controls="close-search-modal"
                >
                  <CloseIcon className="text-gray-900 dark:text-gray-100 text-xl" />
                </button>
              </div>
              <form className="flex flex-col" onSubmit={handlePostData}>
                <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                  <div>
                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                      Social Links
                    </h5>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                      <div>
                        <label>Facebook</label>
                        <Input
                          type="text"
                          value=""
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label>X.com</label>
                        <Input
                          type="text"
                          value=""
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label>Linkedin</label>
                        <Input
                          type="text"
                          value=""
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label>Instagram</label>
                        <Input
                          type="text"
                          value=""
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-7">
                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                      Personal Information
                    </h5>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                      <div className="col-span-2 lg:col-span-1">
                        <label>First Name</label>
                        <Input
                          type="text"
                          name="firstName"
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          value={userDetail.firstName}
                          onChange={handleChange}
                          // onInput={(e)=>{inputDetail.firstName = e.target.value}}
                        />
                      </div>

                      <div className="col-span-2 lg:col-span-1">
                        <label>Last Name</label>
                        <Input
                          type="text"
                          name="lastName"
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          value={userDetail.lastName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-span-2 lg:col-span-1">
                        <label>Email Address</label>
                        <Input
                          type="text"
                          name="email"
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          value={userDetail.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <label>Username</label>
                        <Input
                          type="text"
                          name="email"
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          value={userDetail.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-span-2 lg:col-span-1">
                        <label>Phone</label>
                        <Input
                          type="text"
                          value=""
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-7">
                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                      Address Information
                    </h5>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                      <div className="col-span-2 lg:col-span-1">
                        <label>Country</label>
                        <Input
                          type="text"
                          value=""
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-span-2 lg:col-span-1">
                        <label>Province</label>
                        <Input
                          type="text"
                          value=""
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-span-2 lg:col-span-1">
                        <label>City</label>
                        <Input
                          type="text"
                          value=""
                          className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalOpen(false);
                        }}
                      >
                        Close
                      </Button>
                      <Button size="sm" type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Transition>
    </>
  );
}

export default EditUserInfoModal;
