import { useState, useRef ,useEffect} from "react";
import Transition from "../../utils/Transition";
import { Label, Button, Input } from "@material-tailwind/react";

function UserInfoModal({ id, modalOpen, setModalOpen }) {
  // const [open, setOpen] = useState(false);
  const modalContent = useRef(null);
  const [updateInfo,setUpdateInfo]=useState({
    first_name:"",
    last_name:"",
    email:"",
    username:"",
  })
  // const handleOpen = () => setOpen(!open);
useEffect(() => {
    const clickHandler = ({ target,e }) => {
      if (!modalOpen || modalContent.current.contains(target)) return;
      // setInputValue("")
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
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
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
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
        <div className="max-w-[700px] m-4">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Edit Personal Information
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Update your details to keep your profile up-to-date.
              </p>
            </div>
            <form className="flex flex-col">
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
                        value="https://www.facebook.com/PimjoHQ"
                        onChange={()=>setUpdateInfo()}
                      />
                    </div>

                    <div>
                      <label>X.com</label>
                      <Input type="text" value="https://x.com/PimjoHQ" />
                    </div>

                    <div>
                      <label>Linkedin</label>
                      <Input
                        type="text"
                        value="https://www.linkedin.com/company/pimjo"
                      />
                    </div>

                    <div>
                      <label>Instagram</label>
                      <Input
                        type="text"
                        value="https://instagram.com/PimjoHQ"
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
                      <Input type="text" value="Musharof" />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <label>Last Name</label>
                      <Input type="text" value="Chowdhury" />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <label>Email Address</label>
                      <Input type="text" value="randomuser@pimjo.com" />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <label>Phone</label>
                      <Input type="text" value="+09 363 398 46" />
                    </div>

                    <div className="col-span-2">
                      <label>Bio</label>
                      <Input type="text" value="Team Manager" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline">
                  Close
                </Button>
                <Button size="sm">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default UserInfoModal;
