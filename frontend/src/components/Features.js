"use client";
import { FaCertificate, FaTags, FaHandshake } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaCertificate className="feature-icon" />,
      title: "100% प्रामाणिक उत्पाद",
      desc: "सभी बीज और खाद प्रमाणित और विश्वशनीय कंपनियों से सीधे मंगाए जाते हैं।",
    },
    {
      icon: <FaTags className="feature-icon" />,
      title: "सर्वोत्तम और उचित मूल्य",
      desc: "किसानों के लिए सबसे किफायती और बेहतरीन बाजार भाव की गारंटी।",
    },
    {
      icon: <FaHandshake className="feature-icon" />,
      title: "सटीक कृषि सलाह",
      desc: "फसल की बुवाई से कटाई तक सही मार्गदर्शन और हर कदम पर सहायता।",
    },
  ];

  return (
    <div className="features-wrapper">
      <section className="features">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon-wrapper">
              {f.icon}
            </div>
            <div className="feature-text">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
