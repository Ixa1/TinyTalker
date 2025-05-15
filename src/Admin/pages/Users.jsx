import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import UserTable from '../components/UserTable';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/users/')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error loading users:', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <UserTable users={users} />
    </div>
  );
};

export default Users;
