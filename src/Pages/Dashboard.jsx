import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useApproveUserMutation,
  useDeactiveUserMutation,
} from "../services/api";

const roleStyle = {
  admin: "bg-purple-100 text-purple-700",
  employee: "bg-blue-100 text-blue-700",
  user: "bg-neutral-100 text-neutral-700",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const me = JSON.parse(localStorage.getItem("user") || "null");

  const { data: result, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [approveUser] = useApproveUserMutation();
  const [deactiveUser] = useDeactiveUserMutation();

  const users = result?.data?.user || [];
  const approvedCount = users.filter((u) => u.status).length;
  const pendingCount = users.length - approvedCount;

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Delete failed");
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditName(item.username);
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const handleUpdate = async (id) => {
    try {
      await updateUser({ id, username: editName }).unwrap();
      cancelEdit();
    } catch (err) {
      alert(err?.data?.message || "Update failed");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Approve failed");
    }
  };

  const handleDeactive = async (id) => {
    try {
      await deactiveUser(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Block failed");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600 hidden sm:block">
              {me?.username || me?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <p className="text-sm text-neutral-500">Total users</p>
            <p className="text-3xl font-semibold text-neutral-900 mt-1">{users.length}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <p className="text-sm text-neutral-500">Approved</p>
            <p className="text-3xl font-semibold text-green-600 mt-1">{approvedCount}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <p className="text-sm text-neutral-500">Pending</p>
            <p className="text-3xl font-semibold text-amber-600 mt-1">{pendingCount}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            Could not load users (status: {error.status}).
            {error.status === 401 && " Session expired, please log in again."}
            {error.status === 403 && " Only admins can view this page."}
          </div>
        )}

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h2 className="font-semibold text-neutral-900">Users</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.length === 0 && !error && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-neutral-400">
                      No users found
                    </td>
                  </tr>
                )}

                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium uppercase">
                          {item.username?.[0] || "?"}
                        </div>
                        <div>
                          {editId === item.id ? (
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-2 py-1 border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-neutral-300"
                            />
                          ) : (
                            <p className="font-medium text-neutral-900">{item.username}</p>
                          )}
                          <p className="text-neutral-500">{item.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleStyle[item.role] || roleStyle.user}`}>
                        {item.role}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status ? "Approved" : "Pending"}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        {editId === item.id ? (
                          <>
                            <button onClick={() => handleUpdate(item.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                              Save
                            </button>
                            <button onClick={cancelEdit} className="px-3 py-1.5 text-xs font-medium border border-neutral-300 rounded-lg hover:bg-neutral-100">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(item)} className="px-3 py-1.5 text-xs font-medium border border-neutral-300 rounded-lg hover:bg-neutral-100">
                              Edit
                            </button>
                            {item.status ? (
                              <button onClick={() => handleDeactive(item.id)} className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100">
                                Block
                              </button>
                            ) : (
                              <button onClick={() => handleApprove(item.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                                Approve
                              </button>
                            )}
                            <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100">
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}