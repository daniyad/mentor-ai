export const CourseDescription = ({ description, skills }: { description: string, skills: string }) => {
    return (
      <div className="course-description">
        <h2>About this course</h2>
        <p>{description}</p>
        <div className="course-skills">
          <h3>Skills you'll gain</h3>
          <ul>
            {skills.split(',').map(skill => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  