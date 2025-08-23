import React from 'react';
import { Link } from 'react-router-dom';
import AddMemberForm from './AddMemberForm';
import MemberList from './MemberList';
import AddClassForm from './AddClassForm';
import ClassList from './ClassList';
import JoinRequestsList from './JoinRequestsList';
import ImageUploader from './ImageUploader';
import FeeManager from './FeeManager';
import FeeDashboard from './FeeDashboard'; // Import the new component

const OwnerDashboard = ({ gymData }) => {
  return (
    <div className="space-y-8 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Managing: {gymData.gymName}</h2>
        <p className="text-slate-600">{gymData.address}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <FeeDashboard gymId={gymData.id} gymName={gymData.gymName} /> {/* Add the new FeeDashboard here */}
          <JoinRequestsList gymId={gymData.id} />
          <AddMemberForm gymId={gymData.id} gymName={gymData.gymName} />
          <MemberList gymId={gymData.id} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ImageUploader gymId={gymData.id} />
          <FeeManager gymId={gymData.id} />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Attendance Management</h3>
            <p className="text-gray-600 mb-4">View and manage monthly attendance for all your members.</p>
            <Link
              to={`/gym/${gymData.id}/attendance`}
              className="w-full block text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Open Attendance Grid
            </Link>
          </div>
          <AddClassForm gymId={gymData.id} />
          <ClassList gymId={gymData.id} />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
