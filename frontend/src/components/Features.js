"use client";
import { FaCertificate, FaTags, FaHandshake } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaCertificate className="feature-icon" />,
      title: "100% प्रामाणिक",
      desc: "सभी बीज और खाद प्रमाणित कंपनियों से सीधे आते हैं।",
    },
    {
      icon: <FaTags className="feature-icon" />,
      title: "उचित मूल्य",
      desc: "किसानों के लिए सबसे किफायती और बेहतरीन बाजार भाव।",
    },
    {
      icon: <FaHandshake className="feature-icon" />,
      title: "कृषि सलाह",
      desc: "फसल की बुवाई से कटाई तक सही मार्गदर्शन और सहायता।",
    },
  ];

  return (
    <section className="features">
      {features.map((f, i) => (
        <div className="feature-card" key={i}>
          {f.icon}
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
