import React from 'react';

const ContactSkeleton = () => {
    return (
        <div>
            <div className="max-w-7xl mx-auto px-6 py-24">
    <div className="flex flex-col gap-4 w-full">
      <div className="skeleton h-12 w-1/3 mx-auto mb-10"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="skeleton h-80 w-full rounded-2xl"></div>
        <div className="space-y-4">
          <div className="skeleton h-12 w-full"></div>
          <div className="skeleton h-12 w-full"></div>
          <div className="skeleton h-40 w-full"></div>
          <div className="skeleton h-12 w-full"></div>
        </div>
      </div>
    </div>
  </div>
        </div>
    );
};

export default ContactSkeleton;