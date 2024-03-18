import { TypeAnimation } from "react-type-animation";

export const CourseHeader = ({ title, course_description }: { title: string, course_description: string }) => {
  return (
    <div className=" text-white p-5">
      <div className="border bg-black border-gray-700 p-4 rounded-lg">
        <h1 className="text-orange-500 text-3xl font-bold mb-2">{title}</h1>
          <TypeAnimation
            sequence={[course_description]}
            wrapper="span"
            cursor={false}
            style={{
              fontSize: "1.25em", // Adjust size as needed
            }}
          />
      </div>
    </div>
  );
};
