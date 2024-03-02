import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Fragment, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { RiLoader2Fill } from "react-icons/ri";
import DateFormatter from "../../../../Components/DateFormatter/DateFormatter";
import {
  deleteApiRequest,
  getApiRequest,
  patchApiRequest,
  postApiRequest,
} from "../../../../api/apiRequest";
import { AuthContext } from "../../../../GlobalContext/AuthProvider";

const MaintainUsers = () => {
  const [visible, setVisible] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  const [userError, setUserError] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [key, setKey] = useState(0);

  const { user } = useContext(AuthContext);

  const refetchUser = () => {
    setKey((pre) => pre + 1);
  };

  useEffect(() => {
    getApiRequest("/api/v2/user/users").then((res) => {
      setAllUser(res?.data);
    });
  }, [key]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data && data?.role) {
      setUserLoading(true);

      const user = {
        username: data.username,
        role: data.role,
        password: data.password,
      };

      postApiRequest("/api/v2/user/register", user)
        .then((res) => {
          if (res) {
            setUserError("");
            toast.success("New user created successfully");
          }
        })
        .catch((err) => {
          setUserError(err?.response?.data?.message);
        })
        .finally(() => {
          setUserLoading(false);
          refetchUser();
        });
    }
  };

  const handleChangeRole = (e) => {
    e.preventDefault();
    const userRole = e.target.role.value;

    const data = {
      role: userRole,
    };

    if (userRole) {
      setEditLoading(true);
      patchApiRequest(`/api/v2/user/edit/role/${editedUser?._id}`, data)
        .then((res) => {
          if (res) {
            setIsOpen(!isOpen);
            setUserError("");
          }
        })
        .catch((err) => {
          if (err) {
            setUserError(err?.response?.data?.message);
          }
        })
        .finally(() => {
          refetchUser();
          setEditLoading(false);
        });
    }
  };

  const [sec, setSec] = useState("");

  const handleDeleteUser = (id) => {
    let secondsLeft = 5;

    const countdown = () => {
      secondsLeft--;
      setSec(secondsLeft);

      if (secondsLeft > 0) {
        setTimeout(countdown, 1000);
      } else {
        deleteApiRequest(`/api/v2/user/delete/${id}`)
          .then((res) => {
            if (res) {
              toast.success("user deleted");
            }
          })
          .catch((err) => {
            if (err) {
              toast.error("something went wrong");
            }
          })
          .finally(() => {
            refetchUser();
          });
      }
    };

    countdown();
  };

  return (
    <div>
      <div className="w-full px-4 pt-4">
        <div className="mx-auto w-full max-w-md shadow-md rounded-2xl bg-white p-2 mb-8">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                  <span>Want to add new user?</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <div>
                      <label>Username*</label>
                      <input
                        className="h-[40px] w-full border-2 border-purple-900 rounded-md px-2"
                        type="text"
                        placeholder="Username"
                        {...register("username", {
                          required: "Warning! Username is required",
                        })}
                        aria-invalid={errors.username ? "true" : "false"}
                      />
                      {errors.username && (
                        <p className="text-red-700" role="alert">
                          {errors.username?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Select role*</label>
                      <select
                        className="h-[40px] w-full border-2 border-purple-900 rounded-md"
                        {...register("role", {
                          required: "Warning! Role is required",
                        })}
                        aria-invalid={errors.role ? "true" : "false"}
                      >
                        <option value="" disabled selected>
                          Choose a role
                        </option>
                        <option value="admin">Admin</option>
                        <option value="chairman">Chairman</option>
                        <option value="manager">Manager</option>
                      </select>
                      {errors.role && (
                        <p className="text-red-700" role="alert">
                          {errors.role?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label>Password*</label>
                      <input
                        className="h-[40px] w-full border-2 border-purple-900 rounded-md px-2"
                        type={visible ? "text" : "password"}
                        placeholder="Password"
                        required
                        {...register("password")}
                        aria-invalid={errors.password ? "true" : "false"}
                      />
                      {visible ? (
                        <FaEyeSlash
                          onClick={() => setVisible(!visible)}
                          className="h-4 w-4 cursor-pointer absolute bottom-3 right-2"
                        />
                      ) : (
                        <FaEye
                          onClick={() => setVisible(!visible)}
                          className="h-4 w-4 cursor-pointer absolute bottom-3 right-2"
                        />
                      )}
                    </div>
                    <p className="text-red-600">{userError}</p>
                    <div className="">
                      <button
                        type="submit"
                        disabled={userLoading}
                        className="h-[40px] w-full bg-purple-900 hover:bg-opacity-80 text-white rounded-md flex items-center justify-center"
                      >
                        {userLoading ? (
                          <RiLoader2Fill className="h-5 w-5 animate-spin" />
                        ) : (
                          "Create user"
                        )}
                      </button>
                    </div>
                  </form>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        <div>
          {allUser &&
            allUser.map((u, index) => (
              <div
                key={u._id}
                className="max-w-5xl mx-auto min-h-[60px] border-b border-gray-300 flex justify-between items-center px-2"
              >
                <div className="flex items-center">
                  <div className="mr-2">{index + 1}.</div>
                  <div className="flex items-center">
                    <p>Username:</p>
                    <p className="ml-2">{u.username}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-8">
                  <div className="flex items-center">
                    <p>Role:</p>
                    <p
                      className={`ml-2 font-bold ${
                        u?.role == "admin" || u?.role == "chairman"
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {u.role}
                    </p>
                  </div>
                  <div className="flex items-center space-x-12">
                    <DateFormatter dateString={u.createdAt} />
                    <button
                      onClick={() => {
                        setEditedUser(u);
                        setIsOpen(!isOpen);
                      }}
                      className="bg-blue-600 px-2 py-1 text-white rounded hover:bg-opacity-70"
                    >
                      Change Role
                    </button>
                    <button
                      disabled={sec || user.username == u.username}
                      onClick={() => handleDeleteUser(u?._id)}
                      className={`underline ${
                        user?.username == u?.username
                          ? "text-white"
                          : "text-red-600"
                      }`}
                    >
                      {sec ? sec : "delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(!isOpen)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[300px] transform overflow-hidden rounded bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleChangeRole}>
                    <div>
                      <label>Select role*</label>
                      <select
                        required
                        name="role"
                        className="h-[40px] w-full border-2 border-purple-900 rounded-md"
                      >
                        <option value="" disabled selected>
                          Choose a role
                        </option>
                        <option value="admin">Admin</option>
                        <option value="chairman">Chairman</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <p className="text-red-600">{userError}</p>
                    <div className="mt-2">
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="h-[40px] w-full border-2 border-purple-900 bg-purple-900 text-white rounded-md flex items-center justify-center"
                      >
                        Submit
                        {editLoading ? (
                          <RiLoader2Fill className="w-6 h-6 animate-spin text-white" />
                        ) : null}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default MaintainUsers;
