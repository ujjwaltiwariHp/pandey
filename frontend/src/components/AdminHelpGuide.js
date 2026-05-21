"use client";
import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaDownload, FaArrowDown, FaCheckCircle, FaList, FaBox, FaImage } from "react-icons/fa";

export default function AdminHelpGuide() {
  const [visibleSteps, setVisibleSteps] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const stepElements = document.querySelectorAll('.help-step-card');
      stepElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          setVisibleSteps(prev => prev.includes(index) ? prev : [...prev, index]);
        }
      });
    };
    
    // Initial check
    setTimeout(handleScroll, 100);
    
    window.addEventListener('scroll', handleScroll, true);
    // document.querySelector('.admin-main') might be the scrolling container
    const mainScroll = document.querySelector('.admin-main');
    if (mainScroll) {
      mainScroll.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      if (mainScroll) mainScroll.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const steps = [
    {
      id: "category",
      title: "1. श्रेणी (Category) कैसे बनाएं?",
      icon: <FaList style={{ color: "#3b82f6" }} />,
      content: (
        <div className="help-content-inner">
          <div className="help-flex">
             <div className="help-box-icon"><FaPlus style={{ color: "#10b981" }}/></div>
             <p><strong>स्टेप 1:</strong> साइडबार में या ऊपर दाईं ओर <strong>"Add Category"</strong> बटन पर क्लिक करें।</p>
          </div>
          <div className="help-arrow"><FaArrowDown /></div>
          <div className="help-flex">
             <div className="help-box-icon"><FaEdit style={{ color: "#f59e0b" }}/></div>
             <p><strong>स्टेप 2:</strong> बॉक्स में श्रेणी का नाम (जैसे: 'धान बीज') और कॉलम के नाम (जैसे: 'बीज का नाम', 'प्रकार') लिखें।</p>
          </div>
          <div className="help-arrow"><FaArrowDown /></div>
          <div className="help-flex">
             <div className="help-box-icon"><FaCheckCircle style={{ color: "#10b981" }}/></div>
             <p><strong>स्टेप 3:</strong> <strong>"Save Category"</strong> पर क्लिक करें। आपकी श्रेणी बनकर तैयार हो जाएगी!</p>
          </div>
          <div className="help-note">
            <FaEdit style={{ color: "var(--secondary)", marginRight: 5 }} />
            <span><strong>बदलना (Edit):</strong> श्रेणी के नाम के बगल में 'Edit' बटन दबाकर आप नाम या कॉलम बदल सकते हैं।</span>
          </div>
          <div className="help-note">
            <FaTrash style={{ color: "#ef4444", marginRight: 5 }} />
            <span><strong>हटाना (Delete):</strong> श्रेणी के बगल में 'Delete' लाल बटन दबाकर आप पूरी श्रेणी हटा सकते हैं।</span>
          </div>
        </div>
      )
    },
    {
      id: "items",
      title: "2. उत्पाद (Items) कैसे जोड़ें?",
      icon: <FaBox style={{ color: "#8b5cf6" }} />,
      content: (
        <div className="help-content-inner">
          <div className="help-flex">
             <div className="help-box-icon"><FaList style={{ color: "#3b82f6" }}/></div>
             <p><strong>स्टेप 1:</strong> बाईं ओर (Sidebar) से अपनी मनचाही श्रेणी (Category) पर क्लिक करें।</p>
          </div>
          <div className="help-arrow"><FaArrowDown /></div>
          <div className="help-flex">
             <div className="help-box-icon"><FaPlus style={{ color: "#10b981" }}/></div>
             <p><strong>स्टेप 2:</strong> ऊपर दाईं ओर हरे रंग के <strong>"Add Item"</strong> बटन पर क्लिक करें।</p>
          </div>
          <div className="help-arrow"><FaArrowDown /></div>
          <div className="help-flex">
             <div className="help-box-icon"><FaEdit style={{ color: "#f59e0b" }}/></div>
             <p><strong>स्टेप 3:</strong> सभी बॉक्स में उत्पाद की जानकारी भरें। Hinglish में लिखने पर यह अपने आप हिंदी में बदल जाएगा!</p>
          </div>
          <div className="help-arrow"><FaArrowDown /></div>
          <div className="help-flex">
             <div className="help-box-icon"><FaCheckCircle style={{ color: "#10b981" }}/></div>
             <p><strong>स्टेप 4:</strong> <strong>"Save"</strong> बटन दबाएं। उत्पाद लिस्ट में सबसे नीचे जुड़ जाएगा।</p>
          </div>
          <div className="help-note">
             <FaEdit style={{ color: "var(--secondary)", marginRight: 5 }} />
             <span><strong>बदलना (Edit):</strong> उत्पाद की लाइन में दाईं ओर पीले 'Edit' आइकन पर क्लिक करें।</span>
          </div>
          <div className="help-note">
             <FaTrash style={{ color: "#ef4444", marginRight: 5 }} />
             <span><strong>हटाना (Delete):</strong> उत्पाद की लाइन में दाईं ओर लाल 'Delete' आइकन पर क्लिक करें।</span>
          </div>
        </div>
      )
    },
    {
      id: "download",
      title: "3. लिस्ट (Image) कैसे डाउनलोड करें?",
      icon: <FaDownload style={{ color: "#ec4899" }} />,
      content: (
        <div className="help-content-inner">
          <div className="help-flex">
             <div className="help-box-icon"><FaList style={{ color: "#3b82f6" }}/></div>
             <p><strong>स्टेप 1:</strong> किसी भी श्रेणी को खोलें (जिसकी आपको फोटो चाहिए)।</p>
          </div>
          <div className="help-arrow"><FaArrowDown /></div>
          <div className="help-flex">
             <div className="help-box-icon"><FaDownload style={{ color: "#ec4899" }}/></div>
             <p><strong>स्टेप 2:</strong> सर्च बार के बगल में <strong>"Download Image"</strong> बटन पर क्लिक करें।</p>
          </div>
          <div className="help-arrow"><FaArrowDown /></div>
          <div className="help-flex">
             <div className="help-box-icon"><FaImage style={{ color: "#10b981" }}/></div>
             <p><strong>स्टेप 3:</strong> सिस्टम अपने आप एक खूबसूरत फोटो (या PDF) बना देगा जो आपके मोबाइल या कंप्यूटर में सेव हो जाएगी।</p>
          </div>
          <div className="help-note" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
             <span>💡 <strong>सुझाव:</strong> यह फोटो सीधे WhatsApp या Facebook पर ग्राहकों को भेजने के लिए एकदम सही है! इसमें अपने आप पेज नंबर और दुकान का नाम जुड़ जाता है।</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="help-guide-container">
      <div className="help-header">
        <h1>पाण्डेय ट्रेडर्स — एडमिन गाइड</h1>
        <p>इस पैनल को इस्तेमाल करना बहुत आसान है। नीचे दिए गए स्टेप्स को पढ़ें और अपना काम शुरू करें!</p>
      </div>

      <div className="help-timeline">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`help-step-card ${visibleSteps.includes(index) ? 'visible' : ''}`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="help-step-header">
              <div className="help-step-icon">{step.icon}</div>
              <h2>{step.title}</h2>
            </div>
            <div className="help-step-body">
              {step.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="help-footer">
        <p>✨ <strong>शुभकामनाएं!</strong> अब आप "पाण्डेय ट्रेडर्स" को डिजिटल रूप से मैनेज करने के लिए पूरी तरह तैयार हैं। ✨</p>
      </div>
    </div>
  );
}
