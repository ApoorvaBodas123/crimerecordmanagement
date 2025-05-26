import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import OfficerCard from '@/components/OfficerCard';
import { User } from '@/models/types';

const PoliceDirectory: React.FC = () => {
  const { users, fetchUsers } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.badgeNumber.toString().includes(searchQuery)
    );
    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="relative z-0">
        <h1 className="text-3xl font-bold mb-8">Police Directory</h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or badge number..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No officers found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <OfficerCard
                key={user._id}
                officer={{
                  _id: user._id,
                  name: user.name,
                  badgeNumber: user.badgeNumber,
                  rank: user.role === 'admin' ? 'Administrator' : 'Police Officer',
                  department: user.department,
                  contact: user.phoneNumber,
                  email: user.email
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceDirectory; 