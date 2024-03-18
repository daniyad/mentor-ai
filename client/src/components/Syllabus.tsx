const Syllabus = ({ sections }: { sections: SectionData[] }) => {
    return (
      <div className="course-syllabus">
        <h2>Syllabus</h2>
        {sections.map((section: SectionData) => (
          <div key={section.id} className="section">
            <h3>{section.title}</h3>
            <p>{section.short_description}</p>
            {/* Implement expand/collapse logic here */}
          </div>
        ))}
      </div>
    );
  };

  export default Syllabus;