import React from 'react';

// About component provides an overview of the Botmaps software solution.
const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      {/* Main container with responsive design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card-like structure for content */}
        <div className="bg-white shadow-xl rounded-lg p-6">
          {/* Title of the About section */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Botmaps</h1>
          {/* Description of Botmaps */}
          <p className="text-lg text-gray-600 mb-6">
            Botmaps is a software solution developed for the Faculty of Engineering in the 30 Year Building of Engineering. It’s designed to retrieve scheduling data via API from Teamup and display it in an easy-to-understand format for faculty members, lecturers, and administrative staff.
          </p>
          {/* Mission statement */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Our Mission</h2>
          <p className="text-md text-gray-600 mb-6">
            Botmaps helps to visualize room usage and scheduling patterns, making it easier to manage classroom availability and optimize maintenance scheduling.
          </p>
          {/* Key features list */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Key Features</h2>
          <ul className="list-disc pl-6 text-md text-gray-600 mb-6">
            <li>Displays schedule information for rooms used for lectures and labs.</li>
            <li>Summarizes room usage patterns in a visual dashboard.</li>
            <li>Filters content based on section types or preferences.</li>
            <li>Integrates seamlessly with Google Calendar for event management.</li>
          </ul>
          {/* Target users section */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Target Users</h2>
          <p className="text-md text-gray-600">
            The primary users of Botmaps include faculty members, administrative staff, and lecturers in the 30 Year Building. The intuitive interface and powerful insights enable users to track and manage room usage efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
