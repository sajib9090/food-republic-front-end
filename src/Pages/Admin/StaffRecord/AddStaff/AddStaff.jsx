import { RiLoader2Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import DateFormatter from "../../../../Components/DateFormatter/DateFormatter";
import {
  deleteApiRequest,
  getApiRequest,
  postApiRequest,
} from "../../../../api/apiRequest";

const AddStaff = () => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [allStaff, setAllStaff] = useState([]);
  const [error, setError] = useState("");

  const fetchAllStaff = () => {
    setFetchLoading(true);
    getApiRequest(`/api//v2/staff/staffs`)
      .then((res) => {
        setAllStaff(res?.data);
        setError("");
      })
      .catch((err) => {
        if (err) {
          setError("Can't fetch data");
        }
      })
      .finally(() => {
        setFetchLoading(false);
      });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const staffName = e.target.staffName.value;

    const data = {
      name: staffName.toLowerCase(),
    };

    postApiRequest(`/api/v2/staff/create`, data)
      .then((res) => {
        if (res) {
          toast.success("Staff Added Successfully");
          // Refetch data after successfully post
          fetchAllStaff();
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          setError(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    setLoading(true);
    deleteApiRequest(`/api/v2/staff/delete/${id}`)
      .then((res) => {
        if (res) {
          fetchAllStaff();
        }
      })
      .catch((err) => {
        if (err) {
          toast.error("Something went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllStaff();
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-xs mx-auto p-4 space-y-2">
        <div>
          <label>Write Name*</label>
          <input
            type="text"
            name="staffName"
            required
            placeholder="Enter full name...."
            className="h-[40px] w-full border-2 border-blue-600 rounded px-2"
          />
        </div>
        <div>
          <button
            type="submit"
            className="h-[40px] w-full bg-blue-600 rounded text-white flex justify-center items-center"
          >
            Submit{" "}
            {loading ? (
              <RiLoader2Line className="h-5 w-5 animate-spin text-white" />
            ) : null}
          </button>
        </div>
        <p className="text-red-600">{error}</p>
      </form>
      <div className="max-w-md mx-auto mt-6">
        <p className="text-center">{fetchLoading ? "Loading..." : null}</p>
        {allStaff?.map((item, index) => (
          <div
            key={item?._id}
            className="min-h-[40px] w-full border-b border-gray-300 flex items-center justify-between"
          >
            <div>
              <p>
                {index + 1}. <span className="capitalize">{item?.name}</span>
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div>
                <DateFormatter dateString={item?.createdAt} />
              </div>
              <div>
                {loading ? (
                  <RiLoader2Line className="h-5 w-5 animate-spin text-black" />
                ) : (
                  <MdDelete
                    onClick={() => handleDelete(item?._id)}
                    title="Remove"
                    className="h-6 w-6 text-red-600 cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddStaff;
