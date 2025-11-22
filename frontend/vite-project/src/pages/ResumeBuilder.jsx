import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, Plus, Trash2 } from "lucide-react";

const SmartResumeBuilderEnhanced = () => {
  const [resume, setResume] = useState({
    basic: {
      name: "Your Name",
      title: "Aspiring Software Engineer",
      email: "you@example.com",
      phone: "+91-XXXXXXXXXX",
      location: "Bengaluru, India",
      linkedin: "linkedin.com/in/your-profile",
      github: "github.com/your-username",
      summary:
        "Motivated Computer Science student with a strong interest in web development and problem-solving. Passionate about building user-centric applications and learning modern tech stacks.",
    },
    skills: {
      languages: ["C++", "Python", "JavaScript"],
      frameworks: ["React", "Node.js", "Express"],
      tools: ["Git", "VS Code", "Figma", "Postman"],
    },
    education: [
      {
        id: 1,
        institute: "RV College of Engineering",
        degree: "B.E. in Computer Science and Design",
        duration: "2022 – 2026",
        score: "9.1 CGPA",
      },
    ],
    experience: [
      {
        id: 1,
        role: "Intern – Web Developer",
        company: "Some Startup",
        duration: "May 2024 – Jul 2024",
        points: [
          "Built responsive frontend components using React and Tailwind CSS.",
          "Collaborated with a cross-functional team to develop a dashboard for real-time analytics.",
        ],
      },
    ],
    projects: [
      {
        id: 1,
        name: "Fake Job Detection System",
        techStack: "Python, Scikit-learn, Flask, React",
        points: [
          "Implemented a Random Forest model to classify job postings as genuine or fake.",
          "Developed a web interface in React to upload job descriptions and display predictions.",
        ],
      },
      {
        id: 2,
        name: "IoT-based Air Pollution Monitoring",
        techStack: "Arduino, ESP32, Flask, React",
        points: [
          "Designed a system to sense AQI data and visualize it on a web dashboard.",
          "Integrated ML models to forecast hourly and weekly AQI levels.",
        ],
      },
    ],
  });

  // ✅ This ref points to the preview that will be printed/downloaded
  const resumeRef = useRef(null);

  // ✅ react-to-print v3+ uses contentRef, NOT content: () => ref.current
  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: "My_Resume",
    // ADDED: pageStyle to enforce A4 size and standard 1cm margins for the PDF output
    pageStyle: `@page { size: A4; margin: 1cm; }`,
  });

  // ---------- UPDATE HELPERS ----------
  const updateBasic = (field, value) => {
    setResume((prev) => ({
      ...prev,
      basic: {
        ...prev.basic,
        [field]: value,
      },
    }));
  };

  const updateSkillsList = (field, value) => {
    const list = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setResume((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [field]: list,
      },
    }));
  };

  const updateSectionItem = (section, id, field, value) => {
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addSectionItem = (section, emptyTemplate) => {
    setResume((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        { ...emptyTemplate, id: Date.now() + Math.random() },
      ],
    }));
  };

  const removeSectionItem = (section, id) => {
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  const updateBulletPoint = (section, id, index, newValue) => {
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => {
        if (item.id !== id) return item;
        const newPoints = [...item.points];
        newPoints[index] = newValue;
        return { ...item, points: newPoints };
      }),
    }));
  };

  const addBulletPoint = (section, id) => {
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => {
        if (item.id !== id) return item;
        return { ...item, points: [...item.points, ""] };
      }),
    }));
  };

  const removeBulletPoint = (section, id, index) => {
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          points: item.points.filter((_, i) => i !== index),
        };
      }),
    }));
  };

  return (
    // MIN-H-SCREEN REMOVED to allow the whole page to scroll
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 lg:flex-row">
        {/* LEFT: Editor */}
        <div className="w-full lg:w-1/2 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Smart Resume Builder</h1>
              <p className="text-sm text-slate-300">
                Edit on the left • Preview & download the template on the right.
              </p>
            </div>

            {/* ✅ DOWNLOAD BUTTON */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold px-4 py-2 rounded-xl shadow"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          {/* BASIC INFO */}
          <section className="bg-slate-800/60 rounded-2xl p-4 space-y-3">
            <h2 className="text-lg font-semibold border-b border-slate-700 pb-1">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300">Full Name</label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.basic.name}
                  onChange={(e) => updateBasic("name", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Title</label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.basic.title}
                  onChange={(e) => updateBasic("title", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Email</label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.basic.email}
                  onChange={(e) => updateBasic("email", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Phone</label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.basic.phone}
                  onChange={(e) => updateBasic("phone", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Location</label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.basic.location}
                  onChange={(e) => updateBasic("location", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">LinkedIn</label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.basic.linkedin}
                  onChange={(e) => updateBasic("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">GitHub</label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.basic.github}
                  onChange={(e) => updateBasic("github", e.target.value)}
                  placeholder="github.com/username"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-300">Summary</label>
              <textarea
                className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                rows={3}
                value={resume.basic.summary}
                onChange={(e) => updateBasic("summary", e.target.value)}
              />
            </div>
          </section>

          {/* SKILLS */}
          <section className="bg-slate-800/60 rounded-2xl p-4 space-y-3">
            <h2 className="text-lg font-semibold border-b border-slate-700 pb-1">
              Skills
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300">
                  Languages (comma-separated)
                </label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.skills.languages.join(", ")}
                  onChange={(e) =>
                    updateSkillsList("languages", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">
                  Frameworks / Libraries
                </label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.skills.frameworks.join(", ")}
                  onChange={(e) =>
                    updateSkillsList("frameworks", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Tools</label>
                <input
                  className="w-full mt-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                  value={resume.skills.tools.join(", ")}
                  onChange={(e) => updateSkillsList("tools", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* EDUCATION */}
          <section className="bg-slate-800/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Education</h2>
              <button
                onClick={() =>
                  addSectionItem("education", {
                    institute: "",
                    degree: "",
                    duration: "",
                    score: "",
                  })
                }
                className="flex items-center gap-1 text-xs bg-slate-700 px-2 py-1 rounded-md"
                type="button"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {resume.education.map((ed) => (
                <div
                  key={ed.id}
                  className="border border-slate-700 rounded-xl p-3 space-y-2"
                >
                  <div className="flex justify-between gap-2">
                    <input
                      className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                      placeholder="Institute"
                      value={ed.institute}
                      onChange={(e) =>
                        updateSectionItem(
                          "education",
                          ed.id,
                          "institute",
                          e.target.value
                        )
                      }
                    />
                    <button
                      onClick={() => removeSectionItem("education", ed.id)}
                      className="text-red-400 hover:text-red-300"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm"
                    placeholder="Degree"
                    value={ed.degree}
                    onChange={(e) =>
                      updateSectionItem(
                        "education",
                        ed.id,
                        "degree",
                        e.target.value
                      )
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm"
                      placeholder="Duration"
                      value={ed.duration}
                      onChange={(e) =>
                        updateSectionItem(
                          "education",
                          ed.id,
                          "duration",
                          e.target.value
                        )
                      }
                    />
                    <input
                      className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm"
                      placeholder="Score / CGPA"
                      value={ed.score}
                      onChange={(e) =>
                        updateSectionItem(
                          "education",
                          ed.id,
                          "score",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EXPERIENCE */}
          <section className="bg-slate-800/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Experience</h2>
              <button
                onClick={() =>
                  addSectionItem("experience", {
                    role: "",
                    company: "",
                    duration: "",
                    points: [""]
                  })
                }
                className="flex items-center gap-1 text-xs bg-slate-700 px-2 py-1 rounded-md"
                type="button"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {resume.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="border border-slate-700 rounded-xl p-3 space-y-2"
                >
                  <div className="flex justify-between gap-2">
                    <input
                      className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) =>
                        updateSectionItem(
                          "experience",
                          exp.id,
                          "role",
                          e.target.value
                        )
                      }
                    />
                    <button
                      onClick={() => removeSectionItem("experience", exp.id)}
                      className="text-red-400 hover:text-red-300"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      updateSectionItem(
                        "experience",
                        exp.id,
                        "company",
                        e.target.value
                      )
                    }
                  />
                  <input
                    className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm"
                    placeholder="Duration"
                    value={exp.duration}
                    onChange={(e) =>
                      updateSectionItem(
                        "experience",
                        exp.id,
                        "duration",
                        e.target.value
                      )
                    }
                  />

                  <div className="space-y-2">
                    {exp.points.map((p, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <textarea
                          className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                          placeholder="Achievement / responsibility"
                          value={p}
                          rows={2}
                          onChange={(e) =>
                            updateBulletPoint(
                              "experience",
                              exp.id,
                              idx,
                              e.target.value
                            )
                          }
                        />
                        <button
                          onClick={() =>
                            removeBulletPoint("experience", exp.id, idx)
                          }
                          className="mt-1 text-red-400 hover:text-red-300"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addBulletPoint("experience", exp.id)}
                      className="text-xs text-emerald-300"
                      type="button"
                    >
                      + Add bullet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PROJECTS */}
          <section className="bg-slate-800/60 rounded-2xl p-4 space-y-3 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Projects</h2>
              <button
                onClick={() =>
                  addSectionItem("projects", {
                    name: "",
                    techStack: "",
                    points: [""],
                  })
                }
                className="flex items-center gap-1 text-xs bg-slate-700 px-2 py-1 rounded-md"
                type="button"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {resume.projects.map((pr) => (
                <div
                  key={pr.id}
                  className="border border-slate-700 rounded-xl p-3 space-y-2"
                >
                  <div className="flex justify-between gap-2">
                    <input
                      className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                      placeholder="Project Name"
                      value={pr.name}
                      onChange={(e) =>
                        updateSectionItem(
                          "projects",
                          pr.id,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <button
                      onClick={() => removeSectionItem("projects", pr.id)}
                      className="text-red-400 hover:text-red-300"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm"
                    placeholder="Tech stack (e.g. React, Node, MongoDB)"
                    value={pr.techStack}
                    onChange={(e) =>
                      updateSectionItem(
                        "projects",
                        pr.id,
                        "techStack",
                        e.target.value
                      )
                    }
                  />
                  <div className="space-y-2">
                    {pr.points.map((p, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <textarea
                          className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm"
                          placeholder="What did you build / achieve?"
                          value={p}
                          rows={2}
                          onChange={(e) =>
                            updateBulletPoint(
                              "projects",
                              pr.id,
                              idx,
                              e.target.value
                            )
                          }
                        />
                        <button
                          onClick={() =>
                            removeBulletPoint("projects", pr.id, idx)
                          }
                          className="mt-1 text-red-400 hover:text-red-300"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addBulletPoint("projects", pr.id)}
                      className="text-xs text-emerald-300"
                      type="button"
                    >
                      + Add bullet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Preview (THIS IS WHAT GETS DOWNLOADED) */}
        <div className="w-full lg:w-1/2">
          {/* MODIFIED: Removed max-h-[...] and overflow-auto to allow the preview to be as long as its content. */}
          <div
            ref={resumeRef} // 👈 IMPORTANT: this is what react-to-print uses
            className="bg-white text-black rounded-2xl shadow-xl p-6"
          >
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- PREVIEW COMPONENT ---------------- */

const ResumePreview = ({ resume }) => {
  const { basic, skills, education, experience, projects } = resume;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont" }}>
      {/* HEADER */}
      <div className="border-b border-gray-300 pb-2 mb-3">
        <h1 className="text-2xl font-bold">{basic.name}</h1>
        <p className="text-sm text-gray-700">{basic.title}</p>
        <div className="mt-1 text-xs text-gray-700 space-x-2">
          {basic.email && <span>{basic.email}</span>}
          {basic.phone && <span>• {basic.phone}</span>}
          {basic.location && <span>• {basic.location}</span>}
        </div>
        <div className="mt-1 text-xs text-blue-700 space-x-2">
          {basic.linkedin && <span>{basic.linkedin}</span>}
          {basic.github && <span>• {basic.github}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {basic.summary && (
        <Section title="Summary">
          <p className="text-xs leading-relaxed">{basic.summary}</p>
        </Section>
      )}

      {/* SKILLS */}
      {(skills.languages.length ||
        skills.frameworks.length ||
        skills.tools.length) && (
        <Section title="Skills">
          <div className="text-xs space-y-1">
            {skills.languages.length > 0 && (
              <p>
                <span className="font-semibold">Languages: </span>
                {skills.languages.join(", ")}
              </p>
            )}
            {skills.frameworks.length > 0 && (
              <p>
                <span className="font-semibold">Frameworks/Libraries: </span>
                {skills.frameworks.join(", ")}
              </p>
            )}
            {skills.tools.length > 0 && (
              <p>
                <span className="font-semibold">Tools: </span>
                {skills.tools.join(", ")}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((ed) => (
            <div key={ed.id} className="mb-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">{ed.institute}</span>
                <span>{ed.duration}</span>
              </div>
              <div className="text-xs">
                {ed.degree}
                {ed.score ? ` | ${ed.score}` : ""}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">
                  {exp.role} – {exp.company}
                </span>
                <span>{exp.duration}</span>
              </div>
              <ul className="list-disc pl-4 text-xs mt-1 space-y-1">
                {exp.points.map(
                  (p, idx) => p.trim() && <li key={idx}>{p.trim()}</li>
                )}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((pr) => (
            <div key={pr.id} className="mb-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">{pr.name}</span>
                <span className="text-gray-600">{pr.techStack}</span>
              </div>
              <ul className="list-disc pl-4 text-xs mt-1 space-y-1">
                {pr.points.map(
                  (p, idx) => p.trim() && <li key={idx}>{p.trim()}</li>
                )}
              </ul>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-3">
    <h2 className="text-sm font-semibold border-b border-gray-300 mb-1">
      {title}
    </h2>
    {children}
  </div>
);

export default SmartResumeBuilderEnhanced;