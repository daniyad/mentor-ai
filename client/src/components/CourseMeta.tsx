import { FaUserGraduate, FaClock, FaCertificate, FaCheckSquare } from 'react-icons/fa';

export const CourseMeta = ({ level, timeToComplete, prerequisites }: { level: string, timeToComplete: string, prerequisites: string }) => {
  return (
    <div className="bg-black p-5">
    <div className="bg-black p-5 flex justify-around items-center border border-gray-700 rounded-lg">
      <div className="flex items-center space-x-2">
        <FaUserGraduate color="gray" size="30px"/>
        <div>
          <div className="text-sm uppercase tracking-wider text-gray-500">Skill level</div>
          <div className="text-med font-semibold">{level}</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <FaClock color="gray" size="30px"/>
        <div>
          <div className="text-sm uppercase tracking-wider text-gray-500">Time to complete</div>
          <div className="text-med font-semibold">{timeToComplete}</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <FaCertificate color="gray" size="30px"/>
        <div>
          <div className="text-sm uppercase tracking-wider text-gray-500">Certificate</div>
          <div className="text-med font-semibold">{"At the end of the course"}</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <FaCheckSquare color="gray" size="30px" />
        <div>
          <div className="text-sm uppercase tracking-wider text-gray-500">Prerequisites</div>
          <div className="text-med font-semibold">{prerequisites}</div>
        </div>
      </div>
    </div>
    </div>
  );
};