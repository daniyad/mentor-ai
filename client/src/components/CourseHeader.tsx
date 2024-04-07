import { TypeAnimation } from "react-type-animation";

export const CourseHeader = ({ title, course_description }: { title: string, course_description: string }) => {
  return (
    <div className=" text-white p-5">
      <div className="p-4 rounded-lg" style={{ backgroundColor: '#212121'}}>
        <h1 className="text-orange-500 text-xl font-bold mb-2">{title}</h1>
          <TypeAnimation
            sequence={[course_description]}
            wrapper="span"
            cursor={false}
            style={{
              fontSize: "1em", // Adjust size as needed
            }}
          />
      </div>
    </div>
  );
};
