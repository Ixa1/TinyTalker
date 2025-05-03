const UserTable = ({ users }) => (
    <table className="w-full bg-white rounded shadow mt-6">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-3">Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => (
          <tr key={i} className="text-center border-t">
            <td className="p-2">{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button className="text-red-500 hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  
  export default UserTable;
  