import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



export default function UserPage() {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    console.log('Decoded JWT:', decoded);
    const userId = localStorage.getItem('userId');
    console.log('userId:', userId);
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: ''
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const { firstName, lastName, userName, email } = res.data;
            setFormData({ firstName, lastName, userName, email });
            setLoading(false);
        }).catch(err => {
            console.error('❌ Failed to fetch user data:', err);
            setLoading(false);
        });
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:8080/api/users/${userId}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => alert('✅ User updated successfully'))
            .catch(err => {
                console.error('❌ Update failed:', err);
                alert('Failed to update user');
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    const handleDeleteAccount = async () => {
        if (!window.confirm("⚠️ Are you sure you want to delete your account? This action cannot be undone.")) {
          return;
        }
      
        try {
          await axios.delete(`http://localhost:8080/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
      
          alert('✅ Your account has been deleted.');
          localStorage.clear();
          navigate('/register'); // or redirect to login/register
        } catch (err) {
          console.error('❌ Failed to delete account:', err);
          alert('❌ Error occurred while deleting your account.');
        }
      };
      

      return (
        <div className="pt-20 min-h-screen bg-gray-100">
          <Navbar />
      
          {/* Profile Settings Card */}
          <div className="max-w-xl mx-auto bg-white mt-10 p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">👤 Manage Account</h2>
      
            {loading ? (
              <p className="text-center text-gray-500">Loading user data...</p>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={formData.userName}
                  onChange={handleChange}
                  className={`w-full p-2 border border-gray-300 rounded ${
                      localStorage.getItem('username') === 'admin' ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  readOnly={localStorage.getItem('username') === 'admin'}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
      
                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    💾 Save Changes
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
      
          {/* Danger Zone - Delete Account */}
            {localStorage.getItem('username') !== 'admin' && (
                <div className="max-w-xl mx-auto bg-white mt-6 p-6 rounded shadow border border-red-200">
                    <h3 className="text-xl font-semibold text-red-600 mb-4">Deleting your account cannot be undone.</h3>
                    <button
                        onClick={handleDeleteAccount}
                        className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                    >
                        🗑️ Delete Account
                    </button>
                </div>
            )}

        </div>
      );
      
}
